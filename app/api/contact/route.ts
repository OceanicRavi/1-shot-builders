// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email/sendContactEmail';
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sendContactEmail({ name, email, phone, subject, message });

    if (result.success) {
      return NextResponse.json({ success: true, message: "Email sent successfully." });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to send email", error: result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Email error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}