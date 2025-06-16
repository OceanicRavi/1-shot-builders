import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}) {
  const { name, email, phone, subject, message } = data;

  const htmlContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, "<br/>")}</p>
  `;

  const msg = {
    to: process.env.CONTACT_EMAIL_TO!, // recipient
    from: process.env.CONTACT_EMAIL_FROM!, // verified sender (e.g., we@1shotbuilders.com)
    subject: `[Contact Form] ${subject}`,
    replyTo: email,
    html: htmlContent,
  };

  try {
    const response = await sgMail.send(msg);
    return { success: true, response };
  } catch (error: any) {
    console.error("SendGrid email error:", error);
    throw new Error(error.message || "Failed to send email");
  }
}
