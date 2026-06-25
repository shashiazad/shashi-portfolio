import { Resend } from 'resend';

interface ReferralNotification {
  jobReference: string;
  name: string;
  email: string;
  mobile: string;
  yearsExperience: number;
  techStacks: string[];
  resumeUrl: string;
  timestamp: string;
}

/** Send email notification to owner via Resend */
export async function notifyEmail(data: ReferralNotification): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_EMAIL_FROM;
  const to = process.env.NOTIFY_EMAIL_TO;

  if (!apiKey || !from || !to) {
    console.warn('[notify] Email not configured – skipping');
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    const jobInfo = data.jobReference || 'N/A';

    await resend.emails.send({
      from,
      to,
      subject: `New Referral Request — ${data.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;">
          <h2 style="color:#6366f1;">New Referral Request</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 12px;font-weight:600;">Job</td><td style="padding:6px 12px;">${jobInfo}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:600;">Name</td><td style="padding:6px 12px;">${data.name}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:600;">Email</td><td style="padding:6px 12px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding:6px 12px;font-weight:600;">Phone</td><td style="padding:6px 12px;">${data.mobile}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:600;">Experience</td><td style="padding:6px 12px;">${data.yearsExperience} years</td></tr>
            <tr><td style="padding:6px 12px;font-weight:600;">Tech Stacks</td><td style="padding:6px 12px;">${data.techStacks.join(', ')}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:600;">Resume</td><td style="padding:6px 12px;"><a href="${data.resumeUrl}">Download</a></td></tr>
            <tr><td style="padding:6px 12px;font-weight:600;">Submitted</td><td style="padding:6px 12px;">${data.timestamp}</td></tr>
          </table>
        </div>
      `,
    });

    console.log('[notify] Email sent successfully');
    return true;
  } catch (err) {
    console.error('[notify] Email failed:', err);
    return false;
  }
}

/** Send Slack webhook notification */
export async function notifySlack(data: ReferralNotification): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('[notify] Slack webhook not configured – skipping');
    return false;
  }

  const jobInfo = data.jobReference || 'N/A';

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `📋 *New Referral Request*`,
        blocks: [
          {
            type: 'header',
            text: { type: 'plain_text', text: '📋 New Referral Request' },
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*Job:*\n${jobInfo}` },
              { type: 'mrkdwn', text: `*Name:*\n${data.name}` },
              { type: 'mrkdwn', text: `*Email:*\n${data.email}` },
              { type: 'mrkdwn', text: `*Phone:*\n${data.mobile}` },
              { type: 'mrkdwn', text: `*Experience:*\n${data.yearsExperience} years` },
              { type: 'mrkdwn', text: `*Tech:*\n${data.techStacks.join(', ')}` },
            ],
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: { type: 'plain_text', text: 'View Resume' },
                url: data.resumeUrl,
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) throw new Error(`Slack returned ${res.status}`);
    console.log('[notify] Slack sent successfully');
    return true;
  } catch (err) {
    console.error('[notify] Slack failed:', err);
    return false;
  }
}

/** Send all configured notifications (fire-and-forget with logging) */
export async function sendNotifications(data: ReferralNotification) {
  const results = await Promise.allSettled([notifyEmail(data), notifySlack(data)]);
  results.forEach((r, i) => {
    const channel = i === 0 ? 'email' : 'slack';
    if (r.status === 'rejected') {
      console.error(`[notify] ${channel} failed:`, r.reason);
    }
  });
}
