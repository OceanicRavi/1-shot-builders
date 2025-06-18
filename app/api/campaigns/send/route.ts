import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendCampaignEmail } from '@/lib/email/sendCampaignEmail';

// Use service role client for server-side operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // This bypasses RLS
);

export async function POST(req: NextRequest) {
    try {
        const { campaignId } = await req.json();
        
        if (!campaignId) {
            return NextResponse.json(
                { success: false, error: 'Campaign ID is required' },
                { status: 400 }
            );
        }

        // Get campaign details with template
        const { data: campaign, error: campaignError } = await supabase
            .from('campaigns')
            .select('*')
            .eq('id', campaignId)
            .single();
        
        
        if (campaignError || !campaign) {
            return NextResponse.json(
                { success: false, error: 'Campaign not found' },
                { status: 404 }
            );
        }

        if (campaign.status !== 'draft') {
            return NextResponse.json(
                { success: false, error: 'Campaign has already been sent' },
                { status: 400 }
            );
        }

        // Update campaign status to sending
        await supabase
            .from('campaigns')
            .update({ status: 'sending' })
            .eq('id', campaignId);

        // Get recipients based on tags
        let recipientsQuery = supabase.from('recipients').select('*');

        if (campaign.recipient_tags && campaign.recipient_tags.length > 0) {
            recipientsQuery = recipientsQuery.overlaps('tags', campaign.recipient_tags);
        }

        const { data: recipients, error: recipientsError } = await recipientsQuery;

        if (recipientsError) {
            throw recipientsError;
        }

        if (!recipients || recipients.length === 0) {
            await supabase
                .from('campaigns')
                .update({ status: 'failed' })
                .eq('id', campaignId);

            return NextResponse.json(
                { success: false, error: 'No recipients found for this campaign' },
                { status: 400 }
            );
        }

        // Create campaign recipient records
        const campaignRecipients = recipients.map(recipient => ({
            campaign_id: campaignId,
            recipient_id: recipient.id,
            email_sent: false,
        }));

        const { data: createdRecipients, error: createError } = await supabase
            .from('campaign_recipients')
            .insert(campaignRecipients)
            .select();

        if (createError) {
            throw createError;
        }

        // Send emails
        let successCount = 0;
        let failureCount = 0;
        const { data: template, error: templateError } = await supabase
            .from('email_templates')
            .select('*')
            .eq('id', campaign.template_id)
            .single();

        for (let i = 0; i < recipients.length; i++) {
            const recipient = recipients[i];
            const campaignRecipient = createdRecipients[i];

            try {
                // Replace variables in template
                let emailHtml = template.body_html;
                let emailSubject = template.subject;

                // Simple variable replacement
                emailHtml = emailHtml.replace(/\{\{name\}\}/g, recipient.name);
                emailHtml = emailHtml.replace(/\{\{email\}\}/g, recipient.email);
                emailSubject = emailSubject.replace(/\{\{name\}\}/g, recipient.name);


                const recipientEmail = recipient.email;
                const subject = emailSubject;
                const html = emailHtml;

                const result = await sendCampaignEmail({ recipientEmail, subject, html });

                // Update campaign recipient as sent
                await supabase
                    .from('campaign_recipients')
                    .update({
                        email_sent: true,
                        sent_at: new Date().toISOString(),
                    })
                    .eq('id', campaignRecipient.id);

                successCount++;
            } catch (error: any) {
                // Update campaign recipient with error
                await supabase
                    .from('campaign_recipients')
                    .update({
                        email_sent: false,
                        error_message: error.message,
                    })
                    .eq('id', campaignRecipient.id);

                failureCount++;
            }
        }

        // Update campaign status
        const finalStatus = failureCount === 0 ? 'sent' : (successCount === 0 ? 'failed' : 'sent');
        await supabase
            .from('campaigns')
            .update({
                status: finalStatus,
                sent_at: new Date().toISOString(),
            })
            .eq('id', campaignId);

        return NextResponse.json({
            success: true,
            message: `Campaign sent successfully. ${successCount} emails sent, ${failureCount} failed.`,
            stats: { successCount, failureCount }
        });

    } catch (error: any) {
        console.error('Campaign send error:', error);

        // Update campaign status to failed
        if (req.body) {
            const { campaignId } = await req.json();
            await supabase
                .from('campaigns')
                .update({ status: 'failed' })
                .eq('id', campaignId);
        }

        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}