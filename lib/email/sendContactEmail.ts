import sgMail from "@sendgrid/mail";
import { supabase } from "../supabase";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}) {
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

    // Variable replacement in subject and HTML
    let emailHtml = template.body_html;
    let emailSubject = template.subject;

    emailHtml = emailHtml.replace(/\{\{name\}\}/g, name)
                         .replace(/\{\{email\}\}/g, email)
                         .replace(/\{\{phone\}\}/g, phone)
                         .replace(/\{\{title\}\}/g, subject)
                         .replace(/\{\{message\}\}/g, message);

    emailSubject = emailSubject.replace(/\{\{name\}\}/g, name);

    // Define recipient list (user + internal)
    const recipients = [email, process.env.CONTACT_EMAIL_TO!];

    const msg = {
      to: recipients, // user and internal
      from: process.env.CONTACT_EMAIL_FROM!, // e.g., we@companydomain
      subject: emailSubject,
      replyTo: email, // user can reply directly
      html: emailHtml,
    };

    const response = await sgMail.send(msg);
    return { success: true, response };

  } catch (error: any) {
    console.error("SendGrid email error:", error);
    return { success: false, error: error.message || "Failed to send email" };
  }
}
