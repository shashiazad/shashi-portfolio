import { NextRequest } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { apiSuccess, apiError, audit } from '@/lib/constitution';

// Auth is handled by middleware (Basic Auth).

export const dynamic = 'force-dynamic';

/** DELETE /api/admin/referrals/:id — Delete a referral request by id */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return apiError('Referral ID is required', 400);
  }

  const supabase = getSupabaseServer();

  // Optionally delete the stored resume file first
  const { data: referral } = await supabase
    .from('referral_requests')
    .select('resume_url')
    .eq('id', id)
    .single();

  const resumeUrl = (referral as Record<string, string> | null)?.resume_url;
  if (resumeUrl) {
    await supabase.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET || 'resumes')
      .remove([resumeUrl]);
  }

  // Delete the referral record
  const { error } = await supabase
    .from('referral_requests')
    .delete()
    .eq('id', id);

  if (error) {
    return apiError(error.message, 500);
  }

  audit('referral.deleted', { referralId: id });
  return apiSuccess({ deleted: true });
}
