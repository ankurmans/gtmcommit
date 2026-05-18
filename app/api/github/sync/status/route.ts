import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const jobId = request.nextUrl.searchParams.get('jobId');
  const admin = createAdminClient();

  let query = admin
    .from('github_sync_jobs')
    .select('id, status, repos_scanned, commits_analyzed, ai_commits_found, error_message, started_at, completed_at, created_at')
    .eq('profile_id', profile.id);

  if (jobId) {
    query = query.eq('id', jobId);
  } else {
    query = query.order('created_at', { ascending: false }).limit(1);
  }

  const { data: job } = await query.maybeSingle();

  return NextResponse.json({ job });
}
