import { NextRequest } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { apiError, apiSuccess } from '@/lib/constitution';
import { articleSchema } from '@/lib/validations/referral';

export const dynamic = 'force-dynamic';

/** GET /api/admin/articles — List all articles */
export async function GET() {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    return apiError(error.message, 500);
  }

  return apiSuccess({ articles: data ?? [] });
}

/** POST /api/admin/articles — Create a new article */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = articleSchema.safeParse(body);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return apiError('Validation failed', 400, fieldErrors);
    }

    const values = {
      ...result.data,
      featured_image: result.data.featured_image || null,
      published_at: result.data.is_published ? result.data.published_at || new Date().toISOString() : null,
    } as const;

    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('articles')
      .insert(values as never)
      .select()
      .single();

    if (error) {
      return apiError(error.message, 500);
    }

    return apiSuccess({ article: data }, 201);
  } catch {
    return apiError('Invalid request body', 400);
  }
}

/** PATCH /api/admin/articles — Update an article */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) {
      return apiError('Article ID is required', 400);
    }

    const result = articleSchema.partial().safeParse(rest);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return apiError('Validation failed', 400, fieldErrors);
    }

    const updatePayload: Record<string, unknown> = {
      ...result.data,
      featured_image: result.data.featured_image || null,
    };

    if (result.data.is_published && !result.data.published_at) {
      updatePayload.published_at = new Date().toISOString();
    }

    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from('articles')
      .update(updatePayload as never)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return apiError(error.message, 500);
    }

    return apiSuccess({ article: data });
  } catch {
    return apiError('Invalid request body', 400);
  }
}

/** DELETE /api/admin/articles — Delete an article permanently */
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return apiError('Article ID is required', 400);
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      return apiError(error.message, 500);
    }

    return apiSuccess({ deleted: true });
  } catch {
    return apiError('Invalid request body', 400);
  }
}
