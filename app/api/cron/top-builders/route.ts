import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/send';
import { topBuildersEmail } from '@/lib/email/templates/top-builders';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Get all scored profiles with their current and snapshot scores
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, user_id, display_name, username, gtmcommit_score, gtmcommit_tier, email_notifications, weekly_score_snapshot')
    .gt('gtmcommit_score', 0)
    .order('gtmcommit_score', { ascending: false });

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ sent: 0, movers: 0 });
  }

  const totalBuilders = profiles.length;

  // Compute score changes (current - snapshot)
  const withChanges = profiles.map(p => ({
    ...p,
    score_change: p.gtmcommit_score - (p.weekly_score_snapshot || 0),
  }));

  // Top 3 movers (biggest positive score change)
  const topMovers = [...withChanges]
    .filter(p => p.score_change > 0)
    .sort((a, b) => b.score_change - a.score_change)
    .slice(0, 3)
    .map(p => ({
      display_name: p.display_name,
      username: p.username,
      score: p.gtmcommit_score,
      tier: p.gtmcommit_tier,
      score_change: p.score_change,
    }));

  // Top 5 overall
  const topOverall = profiles.slice(0, 5).map(p => ({
    display_name: p.display_name,
    username: p.username,
    score: p.gtmcommit_score,
    tier: p.gtmcommit_tier,
    score_change: 0,
  }));

  // Only send if there are movers
  if (topMovers.length === 0) {
    // Still update snapshots
    await updateSnapshots(supabase, profiles);
    return NextResponse.json({ sent: 0, movers: 0, reason: 'no_movers' });
  }

  // Send to all users with email_notifications enabled
  let sent = 0;
  const emailRecipients = profiles.filter(p => p.email_notifications);

  for (const profile of emailRecipients) {
    const { data: { user } } = await supabase.auth.admin.getUserById(profile.user_id);
    if (!user?.email) continue;

    const email = topBuildersEmail(profile.display_name, topMovers, topOverall, totalBuilders);
    const success = await sendEmail({ to: user.email, ...email });
    if (success) sent++;
  }

  // Update weekly score snapshots for next week's comparison
  await updateSnapshots(supabase, profiles);

  return NextResponse.json({ sent, movers: topMovers.length, totalBuilders });
}

async function updateSnapshots(supabase: any, profiles: any[]) {
  // Batch update snapshots — update each profile's snapshot to current score
  for (const p of profiles) {
    await supabase
      .from('profiles')
      .update({ weekly_score_snapshot: p.gtmcommit_score })
      .eq('id', p.id);
  }
}
