import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendCampaignEmail(data: {
  recipientEmail: string;
  subject: string;
  html: string;
}) {
  const { recipientEmail, subject, html } = data;

  const msg = {
    to: recipientEmail, // recipient
    from: process.env.CAMPAIGN_EMAIL_FROM!, // verified sender (e.g., we@1shotbuilders.com)
    subject: subject,
    html: html,
  };

  try {
    const response = await sgMail.send(msg);
    return { success: true, response };
  } catch (error: any) {
    console.error("SendGrid email error:", error);
    throw new Error(error.message || "Failed to send email");
  }
}
