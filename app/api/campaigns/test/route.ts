import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { EmailService } from '@/lib/email/emailService';

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();
    const { templateId, recipientEmail, fromEmail, fromName, replyTo, testData } = body;

    if (!templateId || !recipientEmail || !fromEmail || !fromName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { error: 'Invalid recipient email address' },
        { status: 400 }
      );
    }
    // Get template
    const { data: template, error: templateError } = await db.emailTemplates.getById(templateId);

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Verify sender exists in contacts
    const { data: allSenders, error: senderError } = await db.contacts.listByType('sender');

    const senderContact = allSenders?.filter(c => c.email === fromEmail);


    if (senderError || !senderContact) {
      return NextResponse.json(
        { error: 'Sender address not found in your contacts' },
        { status: 400 }
      );
    }

    // Send test email
    const result = await EmailService.sendTestEmail({
      templateId,
      recipientEmail,
      fromEmail,
      fromName,
      replyTo,
      testData
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${recipientEmail}`
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send test email' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send test email' },
      { status: 500 }
    );
  }
}