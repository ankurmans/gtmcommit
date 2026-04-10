const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://gtmcommit.com';

interface ActivationEmailResult {
  subject: string;
  html: string;
}

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f8fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px">
    <div style="background:#fff;border-radius:16px;padding:40px;border:1px solid #f3f4f6">
      <div style="text-align:center;margin-bottom:24px">
        <div style="display:inline-block;background:linear-gradient(135deg,#FF5C00,#FF8533);color:#fff;font-weight:800;font-size:18px;padding:8px 20px;border-radius:20px">GTM Commit</div>
      </div>
      ${content}
      <p style="color:#ccc;font-size:12px;text-align:center;margin-top:32px">Talk is cheap. Commits aren't.</p>
    </div>
  </div>
</body>
</html>`;
}

// Day 1: Welcome — already handled by welcome.ts, but this serves as a reminder
// This sequence starts at Day 3

export function day3CompleteProfile(displayName: string, username: string, hasGithub: boolean, hasBio: boolean): ActivationEmailResult {
  const actions: string[] = [];
  if (!hasGithub) actions.push('<strong>Connect GitHub</strong> — we\'ll auto-detect your AI commits');
  if (!hasBio) actions.push('<strong>Add a bio</strong> — tell visitors what you ship');
  actions.push('<strong>Add a portfolio item</strong> — showcase something you\'ve built');

  return {
    subject: `${displayName}, your profile is 60% done — 2 minutes to finish`,
    html: emailWrapper(`
      <h1 style="font-size:22px;font-weight:700;color:#1a1a1a;text-align:center;margin:0 0 8px">Almost there, ${displayName}</h1>
      <p style="color:#666;text-align:center;margin:0 0 24px;font-size:15px">Your GTM Commit profile is live — let's make it stand out.</p>
      <div style="background:#f7f8fa;border-radius:12px;padding:20px;margin-bottom:24px">
        ${actions.map((a, i) => `<div style="margin-bottom:${i < actions.length - 1 ? '12' : '0'}px">✦ ${a}</div>`).join('')}
      </div>
      <div style="text-align:center">
        <a href="${APP_URL}/profile/edit" style="display:inline-block;background:#FF5C00;color:#fff;padding:12px 32px;border-radius:999px;font-weight:600;font-size:15px;text-decoration:none">Complete Your Profile</a>
      </div>
    `),
  };
}

export function day7ShareProfile(displayName: string, username: string, score: number, tier: string): ActivationEmailResult {
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

  return {
    subject: `Your GTM Commit Score: ${score} — share it on LinkedIn`,
    html: emailWrapper(`
      <h1 style="font-size:22px;font-weight:700;color:#1a1a1a;text-align:center;margin:0 0 8px">You're a ${tierLabel}, ${displayName}</h1>
      <p style="color:#666;text-align:center;margin:0 0 24px;font-size:15px">Your GTM Commit Score is <strong style="color:#FF5C00">${score}</strong>. Time to let people know.</p>
      <div style="background:#f7f8fa;border-radius:12px;padding:20px;margin-bottom:24px">
        <p style="color:#333;font-size:14px;margin:0 0 12px"><strong>Drop this in your LinkedIn bio:</strong></p>
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:12px;font-size:13px;color:#666">
          ${tierLabel} on GTM Commit (${score}/1,000) — gtmcommit.com/${username}
        </div>
        <p style="color:#999;font-size:12px;margin:12px 0 0">Or share your full profile link:</p>
        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:10px;font-size:14px;color:#FF5C00;font-weight:600;margin-top:8px;text-align:center">
          gtmcommit.com/${username}
        </div>
      </div>
      <div style="text-align:center">
        <a href="${APP_URL}/${username}" style="display:inline-block;background:#FF5C00;color:#fff;padding:12px 32px;border-radius:999px;font-weight:600;font-size:15px;text-decoration:none">View Your Profile</a>
      </div>
    `),
  };
}

export function day14VouchAndEngage(displayName: string, username: string): ActivationEmailResult {
  return {
    subject: `${displayName}, vouch for a builder and climb the leaderboard`,
    html: emailWrapper(`
      <h1 style="font-size:22px;font-weight:700;color:#1a1a1a;text-align:center;margin:0 0 8px">Build your reputation</h1>
      <p style="color:#666;text-align:center;margin:0 0 24px;font-size:15px">The best way to get vouched? Vouch for someone else first.</p>
      <div style="background:#f7f8fa;border-radius:12px;padding:20px;margin-bottom:24px">
        <div style="margin-bottom:12px"><strong style="color:#1a1a1a">1. Vouch for a builder</strong><br><span style="color:#666;font-size:14px">Browse the leaderboard and endorse someone whose work you know</span></div>
        <div style="margin-bottom:12px"><strong style="color:#1a1a1a">2. Add a video walkthrough</strong><br><span style="color:#666;font-size:14px">Record a Loom of your workflow — it's the highest-signal proof</span></div>
        <div><strong style="color:#1a1a1a">3. Publish content</strong><br><span style="color:#666;font-size:14px">Tweet, blog, or LinkedIn post about what you built with AI</span></div>
      </div>
      <div style="text-align:center;margin-bottom:12px">
        <a href="${APP_URL}/leaderboard" style="display:inline-block;background:#FF5C00;color:#fff;padding:12px 32px;border-radius:999px;font-weight:600;font-size:15px;text-decoration:none">Browse Leaderboard</a>
      </div>
      <div style="text-align:center">
        <a href="${APP_URL}/showcase" style="display:inline-block;background:transparent;color:#FF5C00;padding:10px 24px;border-radius:999px;font-weight:600;font-size:14px;text-decoration:none;border:1px solid #FF5C00">Add to Showcase</a>
      </div>
    `),
  };
}

export type ActivationStep = 'day3' | 'day7' | 'day14';

export const ACTIVATION_STEPS: { step: ActivationStep; daysAfterSignup: number }[] = [
  { step: 'day3', daysAfterSignup: 3 },
  { step: 'day7', daysAfterSignup: 7 },
  { step: 'day14', daysAfterSignup: 14 },
];
