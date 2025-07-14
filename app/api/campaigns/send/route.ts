import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/services/database';
import { EmailService } from '@/lib/email/emailService';

export async function POST(request: NextRequest) {
  try {
    /*     const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        } */

    const body = await request.json();
    const { campaignId } = body;

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // Get campaign details with template
    const { data: campaign, error: campaignError } = await db.campaigns.getById(campaignId);
    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (campaign.status !== 'draft') {
      return NextResponse.json(
        { error: 'Campaign cannot be sent in current status' },
        { status: 400 }
      );
    }

    if (!campaign.template) {
      return NextResponse.json(
        { error: 'Campaign template not found' },
        { status: 400 }
      );
    }

    // Validate sender info
    if (!campaign.from_email || !campaign.from_name) {
      return NextResponse.json(
        { error: 'From address not configured' },
        { status: 400 }
      );
    }

    // Update campaign status to sending
    await db.campaigns.update(campaignId, { status: 'sending' });

    // Get recipients based on tags
    const { data: recipientsRaw, error: recipientsError } = await db.contacts.listByType('recipient');
    if (recipientsError) {
      throw new Error('Failed to fetch recipients');
    }
    let recipients = recipientsRaw || [];

    if (campaign.recipient_tags?.length > 0) {
      recipients = recipients.filter(recipient =>
        recipient.tags?.some((tag: any) => campaign.recipient_tags.includes(tag))
      );
    }
    if (!recipients || recipients.length === 0) {
      await db.campaigns.update(campaignId, { status: 'failed' });

      return NextResponse.json(
        { error: 'No recipients found for this campaign' },
        { status: 400 }
      );
    }

    // Send emails to all recipients
    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    for (const recipient of recipients) {
      try {
        // Prepare recipient data
        const recipientData = {
          name: recipient.name,
          email: recipient.email,
          first_name: recipient.name.split(' ')[0],
          last_name: recipient.name.split(' ').slice(1).join(' '),
        };

        // Send email
        const result = await EmailService.sendCampaignEmail({
          recipientEmail: recipient.email,
          recipientName: recipient.name,
          recipientData,
          subject: campaign.template.subject,
          html: campaign.template.body_html,
          fromEmail: campaign.from_email,
          fromName: campaign.from_name,
          campaignId
        });

        if (result.success) {
          successCount++;
        } else {
          failureCount++;
          errors.push(`${recipient.email}: ${result.error}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error: any) {
        failureCount++;
        errors.push(`${recipient.email}: ${error.message}`);
        console.error(`Failed to send to ${recipient.email}:`, error);
      }
    }

    // Update campaign status and statistics
    const finalStatus = failureCount === 0 ? 'sent' : (successCount > 0 ? 'sent' : 'failed');

     const { data: campupdate, error: camperr } = await db.campaigns.update(campaignId, {
        status: finalStatus,
        sent_at: new Date().toISOString()
      });
    const message = failureCount === 0
      ? `Campaign sent successfully to ${successCount} recipients.`
      : `Campaign partially sent. ${successCount} successful, ${failureCount} failed.`;

    return NextResponse.json({
      success: true,
      message,
      stats: {
        total: recipients.length,
        success: successCount,
        failed: failureCount,
        errors: errors.slice(0, 5) // Return first 5 errors
      }
    });

  } catch (error: any) {
    console.error('Campaign send error:', error);

    // Update campaign status to failed
    const { campaignId } = await request.json().catch(() => ({}));
    if (campaignId) {
    await db.campaigns.update(campaignId, {
        status: 'failed',
        sent_at: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { error: error.message || 'Failed to send campaign' },
      { status: 500 }
    );
  }
}