import { NextResponse } from 'next/server';
import { waitUntil } from '@vercel/functions';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { syncGitHubData } from '@/lib/github/sync';
import { rateLimit, getUserRateLimitKey } from '@/lib/rate-limit';

export const maxDuration = 300;

const STUCK_THRESHOLD_MS = 10 * 60 * 1000;

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = rateLimit(getUserRateLimitKey(user.id, 'github-sync'), { windowMs: 15 * 60 * 1000, max: 5 });
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, github_access_token')
    .eq('user_id', user.id)
    .single();

  if (!profile?.github_access_token) {
    return NextResponse.json({ error: 'GitHub not connected' }, { status: 400 });
  }

  const admin = createAdminClient();

  // Look at ALL in-flight jobs for this profile, not just the newest. Old cron-era rows
  // can be stuck in `running` forever; we want to clear them before deciding what to do.
  const { data: inflight } = await admin
    .from('github_sync_jobs')
    .select('id, status, started_at, created_at')
    .eq('profile_id', profile.id)
    .in('status', ['pending', 'running'])
    .order('created_at', { ascending: false });

  const now = Date.now();
  const stuckIds: string[] = [];
  let activeJob: { id: string; status: string } | null = null;

  for (const j of inflight || []) {
    const startedAt = j.started_at || j.created_at;
    const ageMs = startedAt ? now - new Date(startedAt).getTime() : Infinity;
    if (ageMs < STUCK_THRESHOLD_MS && !activeJob) {
      activeJob = { id: j.id, status: j.status };
    } else {
      stuckIds.push(j.id);
    }
  }

  if (stuckIds.length) {
    await admin
      .from('github_sync_jobs')
      .update({
        status: 'failed',
        error_message: 'Orphaned — never completed within 10 minutes',
        completed_at: new Date().toISOString(),
      })
      .in('id', stuckIds);
  }

  if (activeJob) {
    return NextResponse.json({ jobId: activeJob.id, status: activeJob.status, alreadyRunning: true });
  }

  // Pre-create the job row so the client can poll it immediately
  const { data: job, error: jobError } = await admin
    .from('github_sync_jobs')
    .insert({ profile_id: profile.id, status: 'pending' })
    .select('id')
    .single();

  if (jobError || !job) {
    return NextResponse.json({ error: 'Failed to create sync job' }, { status: 500 });
  }

  const profileId = profile.id;
  const token = profile.github_access_token;
  const jobId = job.id;

  waitUntil(
    syncGitHubData(profileId, token, jobId).catch((err) => {
      console.error('Background sync error:', err);
    }),
  );

  return NextResponse.json({ jobId, status: 'pending' }, { status: 202 });
}
