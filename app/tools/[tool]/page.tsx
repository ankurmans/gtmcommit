import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/landing/Footer';
import { LuArrowRight, LuTrendingUp, LuUsers, LuZap, LuTarget } from 'react-icons/lu';

interface ToolMeta {
  name: string;
  description: string;
  spotlight: {
    headline: string;
    body: string;
    stats: { label: string; value: string; icon: 'trending' | 'users' | 'zap' | 'target' }[];
    gtmUseCases: string[];
  };
  faq: { q: string; a: string }[];
}

const SPOTLIGHT_ICONS = {
  trending: LuTrendingUp,
  users: LuUsers,
  zap: LuZap,
  target: LuTarget,
};

const TOOL_META: Record<string, ToolMeta> = {
  claude_code: {
    name: 'Claude Code',
    description: 'AI coding assistant by Anthropic for terminal-based development',
    spotlight: {
      headline: 'Claude Code: The terminal-native AI for GTM builders',
      body: 'Claude Code lets you build directly from the terminal with full codebase context. GTM professionals use it to ship landing pages, build automations, and create analytics dashboards — all through natural language conversation. Every commit is automatically tagged with a Co-Authored-By trailer, making it the most verifiable AI coding tool for proof-of-work.',
      stats: [
        { label: 'Detection method', value: 'Co-Author trailer', icon: 'zap' },
        { label: 'Confidence', value: '100%', icon: 'target' },
        { label: 'Best for', value: 'Full-stack builds', icon: 'trending' },
        { label: 'Skill level', value: 'All levels', icon: 'users' },
      ],
      gtmUseCases: [
        'Build landing pages and marketing sites from scratch',
        'Create outbound automation scripts and data pipelines',
        'Ship analytics dashboards and internal tools',
        'Automate repetitive GTM workflows with custom scripts',
      ],
    },
    faq: [
      { q: 'How does GTM Commit detect Claude Code commits?', a: 'Claude Code automatically adds a "Co-Authored-By: Claude" trailer to every commit. GTM Commit detects this trailer with 100% confidence — no configuration needed.' },
      { q: 'Can I use Claude Code if I\'m not a developer?', a: 'Yes. Claude Code is designed for natural language interaction. You describe what you want to build, and it writes and edits the code. Many GTM professionals use it as their primary development tool.' },
      { q: 'Do private repo commits count?', a: 'Yes. GTM Commit can detect AI commits in private repos when you connect GitHub with repo access. Private repo names are never displayed publicly.' },
    ],
  },
  copilot: {
    name: 'GitHub Copilot',
    description: 'AI pair programmer by GitHub for inline code suggestions',
    spotlight: {
      headline: 'GitHub Copilot: AI pair programming inside your editor',
      body: 'GitHub Copilot provides inline code suggestions and chat-based coding assistance directly in VS Code, JetBrains, and other editors. Its Copilot Coding Agent can autonomously work on issues and create pull requests. For GTM professionals, it\'s the most accessible entry point to AI-assisted coding — especially for those already using GitHub.',
      stats: [
        { label: 'Detection method', value: 'Bot commits', icon: 'zap' },
        { label: 'Confidence', value: '100%', icon: 'target' },
        { label: 'Best for', value: 'Editor integration', icon: 'trending' },
        { label: 'Entry barrier', value: 'Lowest', icon: 'users' },
      ],
      gtmUseCases: [
        'Quick edits to marketing websites and landing pages',
        'Autocomplete for scripts and automation code',
        'Agent-driven issue resolution via Copilot Coding Agent',
        'Learning to code with AI-guided suggestions',
      ],
    },
    faq: [
      { q: 'How does GTM Commit detect Copilot commits?', a: 'Copilot\'s Coding Agent commits as "github-copilot[bot]" which GTM Commit detects with 100% confidence. Inline suggestions don\'t leave a commit signature.' },
      { q: 'Do inline Copilot suggestions get detected?', a: 'No. Only commits from Copilot\'s autonomous Coding Agent are detected, since inline autocomplete doesn\'t modify commit metadata.' },
    ],
  },
  cursor: {
    name: 'Cursor',
    description: 'AI-first code editor with intelligent autocomplete and chat',
    spotlight: {
      headline: 'Cursor: The AI-first editor for rapid prototyping',
      body: 'Cursor is a VS Code fork rebuilt around AI-first workflows. It offers inline autocomplete, chat-based editing, and multi-file agentic coding. GTM professionals love it for rapid prototyping — you can build a full landing page or tool in a single session. Branch names and optional Co-Authored-By tags help verify Cursor usage.',
      stats: [
        { label: 'Detection method', value: 'Branch name / tag', icon: 'zap' },
        { label: 'Confidence', value: '70-90%', icon: 'target' },
        { label: 'Best for', value: 'Rapid prototyping', icon: 'trending' },
        { label: 'Learning curve', value: 'Low', icon: 'users' },
      ],
      gtmUseCases: [
        'Rapidly prototype landing pages and marketing tools',
        'Build and iterate on web apps with AI chat assistance',
        'Create email templates and automation UIs',
        'Collaborate with AI on complex multi-file projects',
      ],
    },
    faq: [
      { q: 'Why is Cursor detection confidence lower?', a: 'Cursor doesn\'t add a default commit signature like Claude Code does. Detection relies on branch naming patterns (cursor-*) or user-configured Co-Authored-By tags, which are optional.' },
      { q: 'How can I improve my Cursor detection?', a: 'Add "Co-Authored-By: Cursor <noreply@cursor.com>" to your commit messages. This raises detection confidence to 90%.' },
    ],
  },
  aider: {
    name: 'Aider',
    description: 'Open-source AI coding assistant for the command line',
    spotlight: {
      headline: 'Aider: Open-source terminal AI for power users',
      body: 'Aider is an open-source command-line AI coding tool that works with any LLM (GPT-4, Claude, Gemini, local models). It automatically adds Co-authored-by tags to commits, making every contribution fully verifiable. GTM builders who prefer open-source tools or want model flexibility choose Aider.',
      stats: [
        { label: 'Detection method', value: 'Co-Author tag', icon: 'zap' },
        { label: 'Confidence', value: '100%', icon: 'target' },
        { label: 'Best for', value: 'Open-source fans', icon: 'trending' },
        { label: 'Model support', value: 'Any LLM', icon: 'users' },
      ],
      gtmUseCases: [
        'Build with your choice of AI model (GPT-4, Claude, local)',
        'Terminal-based development with full git integration',
        'Contribute to open-source GTM tools and frameworks',
        'Privacy-focused development with local models',
      ],
    },
    faq: [
      { q: 'How does GTM Commit detect Aider commits?', a: 'Aider automatically adds "Co-authored-by: aider (https://aider.chat)" to commit messages. GTM Commit detects this with 100% confidence.' },
    ],
  },
  windsurf: {
    name: 'Windsurf',
    description: 'AI-powered IDE by Codeium for agentic coding',
    spotlight: {
      headline: 'Windsurf: Agentic IDE for end-to-end builds',
      body: 'Windsurf (by Codeium) is an AI-powered IDE that combines deep codebase understanding with agentic multi-step workflows. It can reason about your entire project, suggest refactors, and execute complex tasks autonomously. GTM professionals use it for larger projects that need architectural understanding.',
      stats: [
        { label: 'Detection method', value: 'Commit signature', icon: 'zap' },
        { label: 'Confidence', value: '100%', icon: 'target' },
        { label: 'Best for', value: 'Complex projects', icon: 'trending' },
        { label: 'Approach', value: 'Agentic IDE', icon: 'users' },
      ],
      gtmUseCases: [
        'Build complex multi-page web applications',
        'Refactor and improve existing marketing codebases',
        'Create data-driven analytics dashboards',
        'End-to-end project builds with AI orchestration',
      ],
    },
    faq: [
      { q: 'How is Windsurf different from Cursor?', a: 'Windsurf focuses on agentic workflows — it can autonomously plan and execute multi-step tasks across your codebase. Cursor is more focused on inline editing and chat-based assistance.' },
    ],
  },
  devin: {
    name: 'Devin',
    description: 'Autonomous AI software engineer by Cognition',
    spotlight: {
      headline: 'Devin: Fully autonomous AI software engineer',
      body: 'Devin by Cognition is a fully autonomous AI agent that can plan, write, debug, and deploy code independently. It works through a full development environment including terminal, browser, and editor. GTM teams use Devin to delegate entire feature builds and bug fixes.',
      stats: [
        { label: 'Detection method', value: 'Bot commit', icon: 'zap' },
        { label: 'Confidence', value: '100%', icon: 'target' },
        { label: 'Best for', value: 'Delegating tasks', icon: 'trending' },
        { label: 'Autonomy', value: 'Full', icon: 'users' },
      ],
      gtmUseCases: [
        'Delegate feature builds to an autonomous agent',
        'Bug fixes and maintenance tasks',
        'Prototype new tools and internal systems',
        'Automated code review and improvements',
      ],
    },
    faq: [
      { q: 'How does GTM Commit detect Devin commits?', a: 'Devin commits as "devin-ai-integration[bot]" which GTM Commit detects with 100% confidence.' },
    ],
  },
  lovable: {
    name: 'Lovable',
    description: 'AI-powered full-stack app builder',
    spotlight: {
      headline: 'Lovable: Build full-stack apps from prompts',
      body: 'Lovable is an AI-powered platform that generates complete full-stack applications from natural language descriptions. No coding knowledge required — describe what you want, and Lovable builds it with a real codebase (React, Supabase, etc.). Perfect for GTM professionals who want to ship apps without writing code.',
      stats: [
        { label: 'Detection method', value: 'Bot commit', icon: 'zap' },
        { label: 'Confidence', value: '100%', icon: 'target' },
        { label: 'Best for', value: 'No-code builders', icon: 'trending' },
        { label: 'Output', value: 'Full-stack apps', icon: 'users' },
      ],
      gtmUseCases: [
        'Build internal tools and dashboards without coding',
        'Ship landing pages and marketing microsites',
        'Create customer-facing apps and portals',
        'Prototype product ideas rapidly',
      ],
    },
    faq: [
      { q: 'How does GTM Commit detect Lovable commits?', a: 'Lovable commits via "lovable[bot]" and includes lovable.dev references. GTM Commit detects these with 100% confidence.' },
      { q: 'Do I need a GitHub account for Lovable?', a: 'Lovable can push to GitHub. Connect your Lovable project to a GitHub repo, and GTM Commit will detect it through the sync pipeline.' },
    ],
  },
};

interface PageProps { params: Promise<{ tool: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tool } = await params;
  const meta = TOOL_META[tool];
  if (!meta) return { title: 'Tool — GTM Commit' };
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gtmcommit.com';
  return {
    title: `${meta.name} for GTM Professionals — GTM Commit`,
    description: `${meta.spotlight.headline}. ${meta.description}. See verified ${meta.name} users on GTM Commit.`,
    openGraph: {
      title: `${meta.name} for GTM Professionals — GTM Commit`,
      description: meta.spotlight.body.slice(0, 200),
      url: `${appUrl}/tools/${tool}`,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { tool } = await params;
  const meta = TOOL_META[tool];
  if (!meta) notFound();

  const supabase = createAdminClient();
  const { data: profiles } = await supabase
    .from('tool_declarations')
    .select('profile_id, is_verified, verified_commit_count, profiles!inner(username, display_name, avatar_url, gtmcommit_score, gtmcommit_tier, role)')
    .eq('tool_name', tool)
    .order('verified_commit_count', { ascending: false })
    .limit(50);

  const users = (profiles || []).map((t: any) => ({
    ...t.profiles,
    is_verified: t.is_verified,
    commit_count: t.verified_commit_count,
  }));

  // Aggregate stats
  const totalCommits = users.reduce((sum: number, u: any) => sum + (u.commit_count || 0), 0);
  const avgScore = users.length > 0
    ? Math.round(users.reduce((sum: number, u: any) => sum + u.gtmcommit_score, 0) / users.length)
    : 0;

  const { spotlight, faq } = meta;

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <h1 className="font-display text-3xl font-bold">{meta.name} for GTM Professionals</h1>
          <p className="text-fg-secondary mt-2 mb-4">{meta.description}.</p>
          <p className="text-sm text-fg-muted mb-8">
            {users.length} verified builders{totalCommits > 0 ? ` · ${totalCommits.toLocaleString()} total commits` : ''}{avgScore > 0 ? ` · Avg score: ${avgScore}` : ''}
          </p>

          {/* Spotlight section */}
          <div className="mb-8 bg-gradient-to-br from-brand-50 to-indigo-50 border border-brand/20 rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold mb-4">{spotlight.headline}</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {spotlight.stats.map((stat) => {
                const Icon = SPOTLIGHT_ICONS[stat.icon];
                return (
                  <div key={stat.label} className="bg-white/70 rounded-xl p-3 flex items-start gap-2">
                    <Icon size={16} className="text-brand mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-fg-primary">{stat.value}</div>
                      <div className="text-xs text-fg-muted">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-fg-secondary leading-relaxed mb-4">{spotlight.body}</p>

            {/* GTM Use Cases */}
            <div className="mt-4">
              <h3 className="text-xs font-bold text-fg-muted uppercase tracking-wider mb-2">How GTM Pros Use {meta.name}</h3>
              <ul className="space-y-1.5">
                {spotlight.gtmUseCases.map((useCase) => (
                  <li key={useCase} className="flex items-start gap-2 text-sm text-fg-secondary">
                    <LuZap size={12} className="text-brand mt-1 shrink-0" />
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/login" className="btn-brand mt-4 inline-flex">
              Prove You Ship with {meta.name} →
            </Link>
          </div>

          {/* User list */}
          {users.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-fg-muted mb-4">No verified {meta.name} users yet.</p>
              <Link href="/login" className="btn-brand">Be the First</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((u: any) => (
                <Link
                  key={u.username}
                  href={`/${u.username}`}
                  className="flex items-center justify-between bg-white border border-surface-border rounded-xl p-4 hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt={u.display_name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm">
                        {u.display_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-sm">{u.display_name}</div>
                      <div className="text-xs text-fg-muted">
                        @{u.username}{u.role ? ` · ${u.role}` : ''}
                        {u.commit_count > 0 && ` · ${u.commit_count} commits`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-brand">{u.gtmcommit_score}</span>
                    <LuArrowRight size={14} className="text-fg-faint" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* FAQ Section with Schema.org markup */}
          {faq.length > 0 && (
            <div className="mt-12 pt-8 border-t border-surface-border">
              <h2 className="font-display text-xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faq.map((item, i) => (
                  <details key={i} className="group bg-surface-secondary rounded-xl">
                    <summary className="cursor-pointer p-4 font-semibold text-sm text-fg-primary list-none flex items-center justify-between">
                      {item.q}
                      <span className="text-fg-faint group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <div className="px-4 pb-4 text-sm text-fg-secondary leading-relaxed">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
              {/* JSON-LD FAQ Schema */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: faq.map((item) => ({
                      '@type': 'Question',
                      name: item.q,
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: item.a,
                      },
                    })),
                  }),
                }}
              />
            </div>
          )}

          {/* Cross-links */}
          <div className="mt-12 pt-8 border-t border-surface-border">
            <h3 className="font-display text-lg font-bold mb-4">Explore Other Tools</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(TOOL_META)
                .filter(([key]) => key !== tool)
                .map(([key, t]) => (
                  <Link
                    key={key}
                    href={`/tools/${key}`}
                    className="px-3 py-1.5 rounded-full bg-surface-secondary border border-surface-border text-xs font-medium text-fg-secondary hover:border-brand/30 hover:text-brand transition-colors"
                  >
                    {t.name}
                  </Link>
                ))}
            </div>
          </div>

          {/* Cross-link to roles */}
          <div className="mt-6">
            <h3 className="font-display text-lg font-bold mb-4">Explore by Role</h3>
            <div className="flex flex-wrap gap-2">
              {['marketer', 'sdr', 'ae', 'growth', 'founder', 'gtm-engineer'].map((role) => (
                <Link
                  key={role}
                  href={`/roles/${role}`}
                  className="px-3 py-1.5 rounded-full bg-surface-secondary border border-surface-border text-xs font-medium text-fg-secondary hover:border-brand/30 hover:text-brand transition-colors"
                >
                  {role.replace(/-/g, ' ').replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
