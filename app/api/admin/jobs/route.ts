import { NextRequest } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { jobSchema } from '@/lib/validations/referral';
import { apiSuccess, apiError, audit } from '@/lib/constitution';

// Auth is handled by middleware (Basic Auth) — no need to check here.

export const dynamic = 'force-dynamic';

/** GET /api/admin/jobs — List all jobs (including inactive) */
export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('posted_at', { ascending: false });

  if (error) {
    return apiError(error.message, 500);
  }
  return apiSuccess({ jobs: data ?? [] });
}

/** POST /api/admin/jobs — Create a new job */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = jobSchema.safeParse(body);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return apiError('Validation failed', 400, fieldErrors);
    }

    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        ...result.data,
        apply_by: result.data.apply_by || null,
        raw_jd: body.raw_jd || null,
        ai_extracted_json: body.ai_extracted_json || null,
      } as never)
      .select()
      .single();

    if (error) {
      return apiError(error.message, 500);
    }
    audit('job.created', { jobId: (data as Record<string, unknown>)?.id, title: result.data.title });
    return apiSuccess({ job: data }, 201);
  } catch {
    return apiError('Invalid request body', 400);
  }
}

/** PATCH /api/admin/jobs — Update a job (pass id in body) */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) {
      return apiError('Job ID is required', 400);
    }

    const result = jobSchema.partial().safeParse(rest);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return apiError('Validation failed', 400, fieldErrors);
    }

    const supabase = getSupabaseServer();
    const updatePayload: Record<string, unknown> = { ...result.data };
    if (body.raw_jd !== undefined) updatePayload.raw_jd = body.raw_jd || null;
    if (body.ai_extracted_json !== undefined) updatePayload.ai_extracted_json = body.ai_extracted_json || null;

    const { data, error } = await supabase
      .from('jobs')
      .update(updatePayload as never)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return apiError(error.message, 500);
    }
    audit('job.updated', { jobId: id });
    return apiSuccess({ job: data });
  } catch {
    return apiError('Invalid request body', 400);
  }
}

/** DELETE /api/admin/jobs — Soft-delete a job (pass id in body) */
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return apiError('Job ID is required', 400);
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase
      .from('jobs')
      .update({ is_active: false } as never)
      .eq('id', id);

    if (error) {
      return apiError(error.message, 500);
    }
    audit('job.deactivated', { jobId: id });
    return apiSuccess({ deactivated: true });
  } catch {
    return apiError('Invalid request body', 400);
  }
}
