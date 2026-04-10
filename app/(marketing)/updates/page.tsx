import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/landing/Footer';
import { LuRocket, LuWrench, LuShield, LuLayoutDashboard, LuGitBranch } from 'react-icons/lu';

export const metadata = { title: 'Updates', description: 'What we\'ve shipped and when — the GTM Commit changelog.' };

const UPDATES = [
  {
    date: 'April 10, 2026',
    entries: [
      {
        type: 'feat' as const,
        title: 'Ship Summary generator',
        description: 'Copy-pasteable credential text in 4 formats (full, LinkedIn, Twitter, email signature). Every copy embeds your profile URL for viral reach.',
      },
      {
        type: 'feat' as const,
        title: 'Enriched tool pages with SEO',
        description: 'All 7 tool pages now have spotlight sections, GTM use cases, FAQs with schema markup, and cross-links to roles. Better for SEO and discovery.',
      },
      {
        type: 'feat' as const,
        title: 'Open to Work badge',
        description: '"Open to Work" badge now shows on profiles and leaderboard for users who toggle it on. Makes talent discoverable.',
      },
      {
        type: 'feat' as const,
        title: 'Competitive intel on dashboard',
        description: 'See your rank among your role, your position among tool users, and how many points until you jump a rank.',
      },
      {
        type: 'feat' as const,
        title: 'Email activation sequence',
        description: 'Day 3/7/14 onboarding emails nudging profile completion, sharing, and community engagement.',
      },
      {
        type: 'feat' as const,
        title: 'Weekly Top Builders spotlight',
        description: 'Weekly email highlighting the 3 biggest score movers and top 5 leaderboard. Creates FOMO and rewards active builders.',
      },
    ],
  },
  {
    date: 'April 6, 2026',
    entries: [
      {
        type: 'feat' as const,
        title: 'Security hardening',
        description: 'SSRF protection on all URL verification, rate limiting on API endpoints, cron authentication, and security headers across the app.',
      },
      {
        type: 'feat' as const,
        title: 'Agent Builder badge',
        description: 'Automatic detection and display of autonomous agent builders based on MCP configs, Claude MD files, and agentic tool usage.',
      },
      {
        type: 'feat' as const,
        title: 'Streak backfill',
        description: 'Existing users get their shipping streak calculated from commit history — no more starting at zero.',
      },
      {
        type: 'feat' as const,
        title: 'Expanded certification support',
        description: 'Auto-verification for Anthropic/Skilljar, Google, Microsoft, AWS, and Coursera certification links.',
      },
      {
        type: 'feat' as const,
        title: 'Portfolio ownership verification',
        description: 'Verify you own a project by adding a meta tag to your site. Verified items get a checkmark badge.',
      },
      {
        type: 'feat' as const,
        title: 'PostHog analytics',
        description: 'Full event tracking across all pages — pageviews, profile views, share clicks, next action clicks, external link clicks, and more.',
      },
      {
        type: 'feat' as const,
        title: 'Scoring v2 algorithm',
        description: 'Commits-first scoring with code impact weighting, private repo bonus, and shipping streak multiplier. Transparent /scoring page documents exactly how points are earned.',
      },
      {
        type: 'feat' as const,
        title: '18 AI tools detected',
        description: 'Now detecting Claude Code, Copilot, Cursor, Aider, Windsurf, Cline, Devin, Lovable, Bolt, v0, Replit Agent, Tabnine, Codeium, Amazon Q, Gemini Code Assist, JetBrains AI, Sourcegraph Cody, and Continue.dev.',
      },
      {
        type: 'feat' as const,
        title: 'Daily GitHub sync',
        description: 'Automated daily cron job keeps your commit data fresh without manual syncing.',
      },
      {
        type: 'feat' as const,
        title: 'Custom platform profiles',
        description: 'Add any platform beyond the preset 8 — type a name and paste a URL.',
      },
      {
        type: 'feat' as const,
        title: 'Gamified dashboard',
        description: 'Next Actions engine, tier progress bar, score breakdown drill-down, leaderboard rank, and profile completeness bar.',
      },
      {
        type: 'feat' as const,
        title: 'Streak system',
        description: 'Weekly streak tracking with flame badge on your dashboard and public profile. Keep shipping every week to build your streak.',
      },
      {
        type: 'feat' as const,
        title: 'Challenges',
        description: 'Onboarding and stretch challenges with progress bars. Complete your profile, sync GitHub, add proofs, vouch for builders — each earns bonus points.',
      },
      {
        type: 'feat' as const,
        title: 'Platform profile URLs',
        description: 'Link your Clay, n8n, Lovable, Cursor, Replit, Vercel, Bolt, and v0 profiles. They show as badges on your public page.',
      },
      {
        type: 'feat' as const,
        title: 'Clay, n8n & Make.com verification',
        description: 'Workflow automation platforms are now first-class proof sources. Add Clay workspace URLs, n8n community templates, or Make.com scenarios as verified proofs.',
      },
      {
        type: 'feat' as const,
        title: 'n8n workflow JSON import',
        description: 'Export your n8n workflows as JSON and import them directly. We parse node complexity, detect AI-powered nodes, and auto-strip credentials for privacy.',
      },
      {
        type: 'feat' as const,
        title: 'Automation platform certifications',
        description: 'n8n and Make.com certification links are now auto-recognized alongside Clay University, HubSpot Academy, and others.',
      },
    ],
  },
  {
    date: 'April 5, 2026',
    entries: [
      {
        type: 'feat' as const,
        title: 'Visitor conversion banner',
        description: 'Unauthenticated visitors on any profile page now see a sticky CTA banner prompting them to get their own score.',
      },
      {
        type: 'feat' as const,
        title: 'Embeddable profile badges',
        description: 'Grab an embed code from your dashboard to display your GTM Commit score on your personal site or README.',
      },
      {
        type: 'feat' as const,
        title: 'Profile comparisons',
        description: 'Compare two profiles side-by-side at /compare — with shareable OG images for social.',
      },
      {
        type: 'feat' as const,
        title: 'Milestone achievements & shareable cards',
        description: 'Hit score milestones and get auto-generated OG images you can share on LinkedIn and Twitter.',
      },
      {
        type: 'feat' as const,
        title: 'Referral tracking',
        description: 'Share your referral link from the dashboard. Referred users who complete a profile earn you bonus score points.',
      },
      {
        type: 'feat' as const,
        title: 'Profile view tracking',
        description: 'See who\'s checking out your profile with view counts and a 7-day sparkline on your dashboard.',
      },
      {
        type: 'feat' as const,
        title: 'Recent Builders feed',
        description: 'Landing page now shows the newest builders who joined, creating social proof and FOMO.',
      },
      {
        type: 'feat' as const,
        title: 'SEO pages for tools & roles',
        description: 'Browse builders by tool (/tools/claude_code) or role (/roles/growth) — auto-generated from community data.',
      },
      {
        type: 'feat' as const,
        title: 'Enhanced share text',
        description: 'Twitter shares now include your score, tier, and #GTMCommit #AIShipped hashtags.',
      },
      {
        type: 'feat' as const,
        title: 'Weekly digest emails',
        description: 'Get a weekly summary of your score changes, new vouches, and profile views.',
      },
      {
        type: 'feat' as const,
        title: 'Public feedback page',
        description: 'Anyone can request features or report bugs at /feedback — no account needed.',
      },
      {
        type: 'feat' as const,
        title: 'Login page with GitHub, Google & LinkedIn',
        description: 'Multiple sign-in options so you can get started with whatever account you prefer.',
      },
      {
        type: 'fix' as const,
        title: 'Score calculation fixes',
        description: 'Fixed anti-gaming filters that were incorrectly rejecting legitimate commits. First-time users now get scored properly without velocity limits.',
      },
    ],
  },
  {
    date: 'April 4, 2026',
    entries: [
      {
        type: 'launch' as const,
        title: 'GTM Commit goes live',
        description: 'Initial launch with GitHub OAuth, AI commit detection (Claude Code, Copilot, Cursor, Aider), proof-of-work scoring, public profiles, and community leaderboard.',
      },
    ],
  },
];

const TYPE_CONFIG = {
  launch: { label: 'Launch', icon: LuRocket, color: 'text-brand bg-brand-50' },
  feat: { label: 'New', icon: LuLayoutDashboard, color: 'text-indigo-600 bg-indigo-50' },
  fix: { label: 'Fix', icon: LuWrench, color: 'text-amber-600 bg-amber-50' },
  security: { label: 'Security', icon: LuShield, color: 'text-red-600 bg-red-50' },
};

export default function UpdatesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <h1 className="font-display text-4xl font-bold">Updates</h1>
          <p className="text-lg text-fg-secondary mt-2">What we&apos;ve shipped and when.</p>

          <div className="mt-10 relative">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-0 w-px bg-surface-border" />

            {UPDATES.map((group, gi) => (
              <div key={gi} className={gi > 0 ? 'mt-10' : ''}>
                {/* Date marker */}
                <div className="flex items-center gap-3 relative">
                  <div className="w-[15px] h-[15px] rounded-full bg-brand border-2 border-white shrink-0 z-10" />
                  <h2 className="font-display text-lg font-bold text-fg-primary">{group.date}</h2>
                </div>

                {/* Entries */}
                <div className="ml-[7px] pl-6 border-l border-transparent space-y-4 mt-4">
                  {group.entries.map((entry, ei) => {
                    const config = TYPE_CONFIG[entry.type];
                    const Icon = config.icon;
                    return (
                      <div key={ei} className="bg-white border border-surface-border rounded-xl p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${config.color}`}>
                            <Icon size={12} />
                            {config.label}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-fg-primary">{entry.title}</h3>
                        <p className="text-sm text-fg-secondary mt-1 leading-relaxed">{entry.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="mt-12 flex items-center gap-2 text-sm text-fg-muted">
            <LuGitBranch size={16} />
            <span>Built in public. Every feature shipped with Claude Code.</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
