import { createHash } from 'crypto';
import { getSupabaseServer } from '@/lib/supabase/server';

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5;

/** Hash an IP address using SHA-256 (privacy-preserving) */
export function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

/** Check rate limit for a given IP hash and endpoint. Returns true if allowed. */
export async function checkRateLimit(
  ipHash: string,
  endpoint: string
): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = getSupabaseServer();
  const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();

  // Count recent requests
  const { count, error } = await supabase
    .from('rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .eq('endpoint', endpoint)
    .gte('created_at', windowStart);

  if (error) {
    console.error('[rate-limit] Query error:', error);
    // Fail open — allow the request but log the error
    return { allowed: true, remaining: MAX_REQUESTS };
  }

  const current = count ?? 0;
  const allowed = current < MAX_REQUESTS;
  const remaining = Math.max(0, MAX_REQUESTS - current);

  if (allowed) {
    // Record this request
    await supabase.from('rate_limits').insert({ ip_hash: ipHash, endpoint } as never);
  }

  return { allowed, remaining };
}

/** Clean up old rate-limit entries (call periodically or via cron) */
export async function cleanupRateLimits() {
  const supabase = getSupabaseServer();
  const cutoff = new Date(Date.now() - WINDOW_MS * 5).toISOString();
  await supabase.from('rate_limits').delete().lt('created_at', cutoff);
}
