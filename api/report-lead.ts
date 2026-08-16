import { Resend } from 'resend';

/**
 * POST /api/report-lead
 * Body: { email, destination, note?, summary?, hp? }
 * Sends ONE notification email to the site owner — no database, no CRM.
 * See NGWAVE-NOTES: Design Doc - Validate Demand (Lead Capture).
 */

const DESTINATIONS = new Set(['material', 'ngwave', 'unsure']);

function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface LeadSummary {
  fileCount?: number;
  totalOccurrences?: number;
  ngwaveAutomatedPct?: number;
  materialAutomatedPct?: number;
}

export default async function handler(
  req: {
    method?: string;
    body: unknown;
  },
  res: {
    status: (code: number) => { json: (body: unknown) => void };
  },
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromDomain = process.env.RESEND_EMAIL_DOMAIN;
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL;
  if (!apiKey || !fromDomain || !notifyTo) {
    res.status(500).json({ error: 'Server is not configured for lead capture.' });
    return;
  }

  const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as {
    email?: string;
    destination?: string;
    note?: string;
    summary?: LeadSummary;
    hp?: string; // honeypot — real users never fill this in
  };

  // Silently accept and drop honeypot submissions — don't tip off bots.
  if (body?.hp) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!isValidEmail(body?.email)) {
    res.status(400).json({ error: 'A valid email address is required.' });
    return;
  }
  const destination = DESTINATIONS.has(body?.destination ?? '') ? body!.destination! : 'unsure';
  const note = typeof body?.note === 'string' ? body.note.slice(0, 2000) : '';
  const summary = body?.summary;

  const summaryHtml = summary
    ? `<ul>
         <li>Files scanned: ${summary.fileCount ?? '—'}</li>
         <li>Total component usages: ${summary.totalOccurrences ?? '—'}</li>
         <li>NgWave automated: ${summary.ngwaveAutomatedPct ?? '—'}%</li>
         <li>Material automated (estimate): ${summary.materialAutomatedPct ?? '—'}%</li>
       </ul>`
    : '<p><em>No report summary attached.</em></p>';

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send(
    {
      from: `NgWave Leads <leads@${fromDomain}>`,
      to: [notifyTo],
      replyTo: body!.email,
      subject: `New migration lead — ${body!.email}`,
      html: `
        <p><strong>Email:</strong> ${escapeHtml(body!.email)}</p>
        <p><strong>Destination interest:</strong> ${escapeHtml(destination)}</p>
        <p><strong>Note:</strong> ${note ? escapeHtml(note) : '<em>none</em>'}</p>
        <p><strong>Report summary:</strong></p>
        ${summaryHtml}
      `,
    },
    { idempotencyKey: `report-lead/${body!.email}/${Date.now()}` },
  );

  if (error) {
    res.status(502).json({ error: error.message || 'Failed to send notification.' });
    return;
  }

  res.status(200).json({ ok: true });
}
