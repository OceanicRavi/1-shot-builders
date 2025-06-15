// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic route
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        // Dynamic import to avoid build issues
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        const body = await req.json();
        const { name, email, phone, subject, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }
        const htmlEmail = `
            <!DOCTYPE html>
            <html lang="en" >
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <style>
                body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
                    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
                background-color: #f9fafb;
                color: #111827;
                margin: 0;
                padding: 0;
                }
                .container {
                max-width: 600px;
                margin: 24px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 16px rgba(0,0,0,0.05);
                padding: 24px;
                border: 1px solid #e5e7eb;
                }
                h2 {
                color: #2563eb;
                margin-bottom: 20px;
                }
                p {
                font-size: 16px;
                line-height: 1.5;
                margin: 8px 0;
                }
                strong {
                color: #374151;
                }
                .footer {
                font-size: 12px;
                color: #9ca3af;
                text-align: center;
                margin-top: 32px;
                }
                a {
                color: #2563eb;
                text-decoration: none;
                }
                a:hover {
                text-decoration: underline;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                ${phone ? `<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br/>')}</p>

                <div class="footer">
                <p>This message was sent from your website contact form.</p>
                </div>
            </div>
            </body>
            </html>
            `;

        const textEmail = `
            New Contact Form Submission

            Name: ${name}
            Email: ${email}
            ${phone ? `Phone: ${phone}` : ''}
            Subject: ${subject}

            Message:
            ${message}

            ---
            This message was sent from your website contact form.
            `;

        await resend.emails.send({
            from: process.env.CONTACT_EMAIL_FROM!,
            to: process.env.CONTACT_EMAIL_TO!,
            subject: `[Contact Form] ${subject}`,
            reply_to: email,
            html: htmlEmail,
            text: textEmail,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Email error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}