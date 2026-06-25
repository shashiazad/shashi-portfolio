import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { apiSuccess, apiError, audit } from '@/lib/constitution';

// Auth is handled by middleware (Basic Auth) — no need to check here.

export const dynamic = 'force-dynamic';

/** GET /api/admin/referrals — List all referral requests */
export async function GET(req: NextRequest) {
  const supabase = getSupabaseServer();
  const url = new URL(req.url);
  const format = url.searchParams.get('format');

  const { data, error } = await supabase
    .from('referral_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return apiError(error.message, 500);
  }

  // CSV export (non-JSON – constitution envelope does not apply)
  if (format === 'csv') {
    const rows = (data ?? []) as Record<string, unknown>[];
    if (rows.length === 0) {
      return new NextResponse('No data', { status: 200, headers: { 'Content-Type': 'text/plain' } });
    }

    const csvHeaders = ['id', 'name', 'email', 'mobile', 'years_experience', 'tech_stacks', 'college', 'latest_education', 'address', 'job_link', 'job_id_with_company', 'resume_url', 'created_at'];
    const csvLines = [csvHeaders.join(',')];

    for (const row of rows) {
      const line = csvHeaders.map((h) => {
        const val = row[h];
        const str = Array.isArray(val) ? val.join('; ') : String(val ?? '');
        return `"${str.replace(/"/g, '""')}"`;
      });
      csvLines.push(line.join(','));
    }

    return new NextResponse(csvLines.join('\n'), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=referrals_${new Date().toISOString().slice(0, 10)}.csv`,
      },
    });
  }

  return apiSuccess({ referrals: data ?? [] });
}

/** POST /api/admin/referrals — Get signed URL for a resume */
export async function POST(req: NextRequest) {
  try {
    const { path } = await req.json();
    if (!path) {
      return apiError('Path is required', 400);
    }

    const supabase = getSupabaseServer();
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET || 'resumes')
      .createSignedUrl(path, 60 * 60); // 1 hour

    if (error) {
      return apiError(error.message, 500);
    }

    audit('resume.signed_url', { path });
    return apiSuccess({ url: data.signedUrl });
  } catch {
    return apiError('Invalid request', 400);
  }
}
