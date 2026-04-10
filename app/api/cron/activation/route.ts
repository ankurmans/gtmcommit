import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/send';
import {
  day3CompleteProfile,
  day7ShareProfile,
  day14VouchAndEngage,
  ACTIVATION_STEPS,
  type ActivationStep,
} from '@/lib/email/templates/activation';

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
  const now = Date.now();
  let sent = 0;

  // For each activation step, find eligible profiles
  for (const { step, daysAfterSignup } of ACTIVATION_STEPS) {
    // Find profiles created ~N days ago (within a 24h window) that haven't received this step
    const targetDate = new Date(now - daysAfterSignup * 86400 * 1000);
    const windowStart = new Date(targetDate.getTime() - 12 * 3600 * 1000).toISOString();
    const windowEnd = new Date(targetDate.getTime() + 12 * 3600 * 1000).toISOString();

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, user_id, display_name, username, gtmcommit_score, gtmcommit_tier, github_username, bio, email_notifications, activation_emails_sent')
      .eq('email_notifications', true)
      .gte('created_at', windowStart)
      .lte('created_at', windowEnd);

    if (!profiles || profiles.length === 0) continue;

    for (const profile of profiles) {
      // Skip if this step was already sent
      const sentSteps: string[] = profile.activation_emails_sent || [];
      if (sentSteps.includes(step)) continue;

      // Get user email
      const { data: { user } } = await supabase.auth.admin.getUserById(profile.user_id);
      if (!user?.email) continue;

      // Build the right email
      const email = buildActivationEmail(step, profile);
      if (!email) continue;

      const success = await sendEmail({ to: user.email, ...email });
      if (success) {
        // Record that this step was sent
        await supabase
          .from('profiles')
          .update({ activation_emails_sent: [...sentSteps, step] })
          .eq('id', profile.id);
        sent++;
      }
    }
  }

  return NextResponse.json({ sent });
}

function buildActivationEmail(
  step: ActivationStep,
  profile: { display_name: string; username: string; gtmcommit_score: number; gtmcommit_tier: string; github_username: string | null; bio: string | null }
): { subject: string; html: string } | null {
  switch (step) {
    case 'day3':
      return day3CompleteProfile(
        profile.display_name,
        profile.username,
        !!profile.github_username,
        !!profile.bio,
      );
    case 'day7':
      return day7ShareProfile(
        profile.display_name,
        profile.username,
        profile.gtmcommit_score,
        profile.gtmcommit_tier,
      );
    case 'day14':
      return day14VouchAndEngage(profile.display_name, profile.username);
    default:
      return null;
  }
}
