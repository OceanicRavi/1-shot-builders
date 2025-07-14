import sgMail from "@sendgrid/mail";
import { supabase } from "../supabase";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface EmailData {
  recipientEmail: string;
  recipientName?: string;
  recipientData?: Record<string, any>;
  subject: string;
  html: string;
  fromEmail: string;
  fromName: string;
  replyTo?: string;
  campaignId?: string;
}

export class EmailService {
  /**
   * Process template variables with recipient data
   */
  static processTemplateVariables(
    content: string, 
    recipientData: Record<string, any> = {},
    globalData: Record<string, any> = {}
  ): string {
    let processedContent = content;
    
    // Combine recipient data with global data (recipient data takes precedence)
    const allData = { ...globalData, ...recipientData };
    
    // Replace all variables in format {{variable_name}}
    processedContent = processedContent.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
      if (allData.hasOwnProperty(variableName)) {
        return String(allData[variableName]);
      }
      
      // Return empty string for undefined variables instead of the placeholder
      console.warn(`Variable "${variableName}" not found in template data`);
      return '';
    });

    // Process common variables if not already provided
    const now = new Date();
    
    const commonVariables: Record<string, string> = {
      date: allData.date || now.toLocaleDateString(),
      time: allData.time || now.toLocaleTimeString(),
      year: allData.year || now.getFullYear().toString(),
      month: allData.month || now.toLocaleDateString('en-US', { month: 'long' }),
      day: allData.day || now.getDate().toString(),
      unsubscribe_url: allData.unsubscribe_url || '#unsubscribe'
    };

    // Replace common variables if they weren't already replaced
    Object.entries(commonVariables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      if (regex.test(processedContent) && !allData.hasOwnProperty(key)) {
        processedContent = processedContent.replace(regex, value);
      }
    });

    return processedContent;
  }

  /**
   * Send campaign email with template processing
   */
  static async sendCampaignEmail(data: EmailData): Promise<{ success: boolean; response?: any; error?: string }> {
    try {
      const {
        recipientEmail,
        recipientName,
        recipientData = {},
        subject,
        html,
        fromEmail,
        fromName,
        replyTo,
        campaignId
      } = data;

      // Prepare recipient data with common fields
      const processedRecipientData = {
        email: recipientEmail,
        name: recipientName || recipientEmail.split('@')[0],
        first_name: recipientName?.split(' ')[0] || recipientEmail.split('@')[0],
        last_name: recipientName?.split(' ').slice(1).join(' ') || '',
        ...recipientData
      };

      // Process subject line
      const processedSubject = this.processTemplateVariables(subject, processedRecipientData);

      // Process HTML content
      const processedHtml = this.processTemplateVariables(html, processedRecipientData);

      // Prepare SendGrid message
      const msg: any = {
        to: recipientEmail,
        from: {
          email: fromEmail,
          name: fromName
        },
        subject: processedSubject,
        html: processedHtml,
        replyTo: replyTo || fromEmail
      };

      // Add custom headers for identification
      if (campaignId) {
        msg.customArgs = {
          campaign_id: campaignId,
          recipient_email: recipientEmail
        };
      }

      // Send email
      const response = await sgMail.send(msg);
      
      return { success: true, response };
    } catch (error: any) {
      console.error("SendGrid email error:", error);
      return { 
        success: false, 
        error: error.message || "Failed to send email" 
      };
    }
  }

  /**
   * Send contact form email with template processing
   */
  static async sendContactEmail(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    phone?: string;
  }): Promise<{ success: boolean; response?: any; error?: string }> {
    const { name, email, phone = "", subject, message } = data;

    try {
      // Fetch email template from Supabase
      const { data: template, error: templateError } = await supabase
        .from("email_templates")
        .select("*")
        .eq("id", process.env.CONTACT_FORM_TEMPLATEID!)
        .single();

      if (templateError || !template) {
        throw new Error("Failed to load email template.");
      }

      // Prepare template data
      const templateData = {
        name,
        email,
        phone,
        title: subject,
        message,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      };

      // Process template content
      const emailSubject = this.processTemplateVariables(template.subject, templateData);
      const emailHtml = this.processTemplateVariables(template.body_html, templateData);

      // Define recipient list (user + internal)
      const recipients = [email, process.env.CONTACT_EMAIL_TO!];

      const msg = {
        to: recipients,
        from: {
          email: process.env.CONTACT_EMAIL_FROM!,
          name: process.env.CONTACT_EMAIL_FROM_NAME || 'Contact Form'
        },
        subject: emailSubject,
        replyTo: email,
        html: emailHtml,
      };

      const response = await sgMail.send(msg);
      return { success: true, response };

    } catch (error: any) {
      console.error("Contact email error:", error);
      return { 
        success: false, 
        error: error.message || "Failed to send email" 
      };
    }
  }

  /**
   * Send test email
   */
  static async sendTestEmail(data: {
    templateId: string;
    recipientEmail: string;
    fromEmail: string;
    fromName: string;
    replyTo?: string;
    testData?: Record<string, any>;
  }): Promise<{ success: boolean; response?: any; error?: string }> {
    try {
      // Fetch template
      const { data: template, error: templateError } = await supabase
        .from("email_templates")
        .select("*")
        .eq("id", data.templateId)
        .single();

      if (templateError || !template) {
        throw new Error("Template not found");
      }

      // Prepare test data
      const testData = {
        name: 'Test User',
        email: data.recipientEmail,
        first_name: 'Test',
        last_name: 'User',
        company: 'Test Company',
        phone: '+1 234 567 8900',
        ...data.testData
      };

      // Send email without campaign tracking
      return await this.sendCampaignEmail({
        recipientEmail: data.recipientEmail,
        recipientData: testData,
        subject: `[TEST] ${template.subject}`,
        html: template.body_html,
        fromEmail: data.fromEmail,
        fromName: data.fromName,
        replyTo: data.replyTo
      });

    } catch (error: any) {
      console.error("Test email error:", error);
      return { 
        success: false, 
        error: error.message || "Failed to send test email" 
      };
    }
  }
}

// Backward compatibility exports
export const sendCampaignEmail = EmailService.sendCampaignEmail;
export const sendContactEmail = EmailService.sendContactEmail;