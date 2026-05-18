# CLAUDE.md — GTM Commit

## Project Overview

**Product name:** GTM Commit
**Domain:** gtmcommit.com
**Tagline:** Talk is cheap. Commits aren't.
**Category:** AI-native GTM community / Proof-of-work professional network
**Target:** Marketers, SDRs, account executives, growth operators who use AI coding tools (Claude Code, Cursor, Windsurf, VS Code + Copilot) to do GTM work — not just talk about it.

### What This Is

GTM Commit is a community platform where AI-native GTM professionals create verified profiles showing what they've actually shipped. Users connect their GitHub (including private repos via OAuth), and GTM Commit automatically detects AI-assisted commits (Claude Code trailers, Copilot bot signatures, Aider co-author tags) to generate a proof-of-work score.

The profile at gtmcommit.com/username becomes the user's public credential — shareable on LinkedIn, Twitter, and job applications — proving they're a doer, not just a talker.

### What This Is NOT

- Not a job board or hiring marketplace (v1)
- Not a LinkedIn replacement — it's a complement (a credential you link TO from LinkedIn)
- Not just for engineers — this is specifically for GTM people who use AI tools
- Not a course or certification — it's proof of actual work output

### Core Thesis

The GTM Engineer role grew 205% from 2024-2025. Companies like Ramp, Intercom, and Apollo are hiring marketers who commit code. But there's no way to verify who's actually AI-native vs who just lists "AI tools" on their LinkedIn. GTM Commit solves this with GitHub-verified proof-of-work scoring.

### Revenue Model (Freemium)

- **Free tier:** Public profile, GitHub integration, basic GTM Commit Score, "Powered by GTM Commit" badge
- **Pro (future):** Remove badge, custom domain, enhanced analytics, priority in directory
- **Enterprise (future):** Team profiles, bulk verification, API access for recruiters

### Viral Growth Mechanics (Built into v1)

1. **Branded URL:** gtmcommit.com/username on every share — each profile is a marketing page
2. **"Powered by GTM Commit" badge:** On all free profiles, links back to signup
3. **Screenshot-worthy profile cards:** OG image auto-generated for social sharing
4. **Community leaderboard:** Top builders ranked by GTM Commit Score — creates FOMO
5. **No signup to browse:** Real profiles visible on landing page before any account creation

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 14+ (App Router) | SSR for SEO-indexable profiles, API routes, Marc Lou proven stack |
| **UI** | Tailwind CSS + DaisyUI | Fast theming, bold components, Marc Lou's exact stack |
| **Database** | Supabase (PostgreSQL) | RLS for profile security, real-time for leaderboard, free tier generous |
| **Auth** | Supabase Auth + GitHub OAuth | GitHub OAuth is core feature, not just login |
| **File Storage** | Supabase Storage | Profile avatars, portfolio screenshots |
| **Hosting** | Vercel | Free tier, instant deploys, edge functions |
| **OG Image Gen** | @vercel/og (Satori) | Dynamic social cards per profile |
| **Email** | Resend | Transactional (welcome, weekly digest) |
| **Analytics** | PostHog | Product analytics, funnel tracking |
| **Payments (future)** | Stripe | When Pro tier launches |

---

## Repository Structure

```
gtmcommit/
├── CLAUDE.md                          ← This file
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.js
├── .env.local.example
│
├── app/
│   ├── layout.tsx                     ← Root layout (DaisyUI theme, fonts)
│   ├── page.tsx                       ← Landing page (hero + featured profiles + leaderboard preview)
│   ├── globals.css
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx             ← Login with GitHub OAuth
│   │   └── callback/page.tsx          ← OAuth callback handler
│   │
│   ├── (marketing)/
│   │   ├── about/page.tsx             ← What is GTM Commit, the movement
│   │   └── leaderboard/page.tsx       ← Full community leaderboard (public, no auth)
│   │
│   ├── (app)/
│   │   ├── layout.tsx                 ← Authenticated layout (sidebar/nav)
│   │   ├── dashboard/page.tsx         ← Your GTM Commit Score, recent activity, profile preview
│   │   ├── profile/
│   │   │   ├── edit/page.tsx          ← Edit profile: bio, tools, links, portfolio items
│   │   │   └── connect/page.tsx       ← Connect GitHub, manage OAuth permissions
│   │   ├── portfolio/
│   │   │   ├── page.tsx               ← Manage portfolio items (add/edit/delete)
│   │   │   └── new/page.tsx           ← Add new portfolio item (URL, screenshots, description)
│   │   └── settings/page.tsx          ← Account settings, notification prefs, delete account
│   │
│   ├── [username]/
│   │   └── page.tsx                   ← PUBLIC profile page (gtmcommit.com/username) — THE viral page
│   │
│   └── api/
│       ├── auth/
│       │   ├── github/route.ts        ← Initiate GitHub OAuth (request repo scope)
│       │   └── callback/route.ts      ← Handle OAuth callback, store tokens
│       ├── github/
│       │   ├── sync/route.ts          ← Trigger GitHub commit analysis
│       │   └── webhooks/route.ts      ← (future) GitHub webhook for real-time commit detection
│       ├── profiles/
│       │   ├── [username]/route.ts    ← Public profile data API
│       │   └── route.ts              ← Profile CRUD
│       ├── portfolio/route.ts         ← Portfolio item CRUD
│       ├── proofs/
│       │   ├── route.ts              ← External proof CRUD (add Vercel/Lovable/Bolt/v0/Replit URLs)
│       │   └── verify/route.ts       ← Trigger verification of a proof URL
│       ├── leaderboard/route.ts       ← Leaderboard data (cached)
│       ├── og/[username]/route.tsx    ← Dynamic OG image generation
│       └── score/calculate/route.ts   ← GTM Commit Score calculation engine
│
├── components/
│   ├── landing/
│   │   ├── Hero.tsx                   ← "Talk is cheap. Commits aren't." + sample profile card
│   │   ├── Problem.tsx                ← The problem: talkers vs doers
│   │   ├── HowItWorks.tsx             ← 3-step: Connect → Verify → Share
│   │   ├── FeaturedProfiles.tsx        ← Real profiles from community (no signup to view)
│   │   ├── LeaderboardPreview.tsx      ← Top 10 from leaderboard
│   │   ├── CTA.tsx                    ← "Get Your GTM Commit" button
│   │   └── Footer.tsx                 ← Links + "Powered by GTM Commit" branding
│   │
│   ├── profile/
│   │   ├── ProfileCard.tsx            ← The shareable profile card (used on profile page + OG)
│   │   ├── GtmCommitScore.tsx          ← Score display with tier badge (Shipper/Builder/Captain/Legend)
│   │   ├── GitHubStats.tsx            ← AI commit heatmap, tool breakdown
│   │   ├── ToolBadges.tsx             ← Claude Code, Cursor, Clay, etc. badges
│   │   ├── PortfolioGrid.tsx          ← Grid of shipped projects
│   │   ├── PortfolioItem.tsx          ← Individual project card (screenshot, URL, description)
│   │   ├── VouchSection.tsx           ← Community endorsements/vouches
│   │   └── PoweredByBadge.tsx         ← "Powered by GTM Commit" footer badge (free tier)
│   │
│   ├── leaderboard/
│   │   ├── LeaderboardTable.tsx       ← Ranked list with score, tier, top tools
│   │   ├── LeaderboardFilters.tsx     ← Filter by role, tool, time period
│   │   └── RankCard.tsx               ← Individual rank display
│   │
│   └── shared/
│       ├── Navbar.tsx
│       ├── Avatar.tsx
│       ├── Badge.tsx                  ← Reusable badge component (tools, tiers, verification)
│       └── ShareButton.tsx            ← Copy profile URL, share to Twitter/LinkedIn
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  ← Browser Supabase client
│   │   ├── server.ts                  ← Server Supabase client
│   │   └── admin.ts                   ← Service role client (for GitHub sync)
│   ├── github/
│   │   ├── oauth.ts                   ← GitHub OAuth flow helpers
│   │   ├── api.ts                     ← GitHub API wrapper (commits, repos, contribution graph)
│   │   ├── detect-ai.ts              ← AI tool detection from commit messages/trailers
│   │   └── sync.ts                    ← Full sync pipeline: fetch → detect → score → store
│   ├── proofs/
│   │   ├── verify.ts                  ← Unified verification dispatcher (routes to platform-specific verifiers)
│   │   ├── vercel.ts                  ← Vercel deployment verification (check if URL resolves to Vercel, extract deploy data)
│   │   ├── lovable.ts                 ← Lovable project verification (public project page scraping)
│   │   ├── replit.ts                  ← Replit repl verification (public repl page, fork count, run count)
│   │   ├── bolt.ts                    ← Bolt.new project verification
│   │   ├── v0.ts                      ← v0.dev generation verification
│   │   ├── url.ts                     ← Generic URL verification (DNS check, HTTP status, meta tag ownership)
│   │   └── screenshot.ts             ← Auto-capture screenshot of verified URLs via Puppeteer/API
│   ├── scoring/
│   │   ├── calculate.ts               ← GTM Commit Score algorithm
│   │   └── tiers.ts                   ← Score → Tier mapping (Shipper/Builder/Captain/Legend)
│   ├── og/
│   │   └── generate.ts               ← OG image template (Satori/React → PNG)
│   └── utils.ts                       ← Shared utilities
│
├── types/
│   └── index.ts                       ← TypeScript types for all entities
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql     ← Full database schema
│
└── public/
    ├── logo.svg
    ├── og-default.png                 ← Default OG image for non-profile pages
    └── badges/                        ← Tool badge SVGs (claude-code, cursor, clay, etc.)
```

---

## Database Schema (Supabase / PostgreSQL)

```sql
-- supabase/migrations/001_initial_schema.sql

-- ============================================================
-- USERS & PROFILES
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Identity
  username TEXT UNIQUE NOT NULL,          -- gtmcommit.com/username
  display_name TEXT NOT NULL,
  bio TEXT,                               -- Max 280 chars
  avatar_url TEXT,
  
  -- Links
  website_url TEXT,
  linkedin_url TEXT,
  twitter_handle TEXT,                    -- @handle (no URL)
  
  -- Professional context
  role TEXT,                              -- 'marketer' | 'sdr' | 'ae' | 'growth' | 'founder' | 'other'
  company TEXT,
  looking_for_work BOOLEAN DEFAULT false,
  
  -- GitHub connection
  github_username TEXT,
  github_access_token TEXT,               -- Encrypted, never exposed via API
  github_connected_at TIMESTAMPTZ,
  github_scopes TEXT[],                   -- ['repo', 'read:user'] etc.
  last_github_sync_at TIMESTAMPTZ,
  
  -- GTM Commit Score (denormalized for fast queries)
  gtmcommit_score INTEGER DEFAULT 0,       -- 0-1000
  gtmcommit_tier TEXT DEFAULT 'unranked',  -- 'unranked' | 'shipper' | 'builder' | 'captain' | 'legend'
  score_breakdown JSONB DEFAULT '{}',     -- { github: 450, portfolio: 200, vouches: 50, tools: 100 }
  
  -- Flags
  is_featured BOOLEAN DEFAULT false,      -- Manually featured on landing page
  is_verified BOOLEAN DEFAULT false,      -- Has at least one verified proof source
  profile_completeness INTEGER DEFAULT 0, -- 0-100 percentage
  
  -- Meta
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_profiles_user ON profiles(user_id);
CREATE UNIQUE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_gtmcommit_score ON profiles(gtmcommit_score DESC);
CREATE INDEX idx_profiles_gtmcommit_tier ON profiles(gtmcommit_tier);
CREATE INDEX idx_profiles_featured ON profiles(is_featured) WHERE is_featured = true;
CREATE INDEX idx_profiles_github ON profiles(github_username) WHERE github_username IS NOT NULL;

-- ============================================================
-- GITHUB COMMIT DATA
-- ============================================================

CREATE TABLE github_commits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Commit identity (deduplication)
  commit_sha TEXT NOT NULL,
  repo_full_name TEXT NOT NULL,           -- 'owner/repo'
  repo_is_private BOOLEAN DEFAULT false,
  
  -- Commit metadata
  commit_message TEXT,                    -- First line only (for privacy on private repos)
  committed_at TIMESTAMPTZ NOT NULL,
  
  -- AI tool detection
  ai_tool_detected TEXT,                  -- 'claude_code' | 'copilot' | 'cursor' | 'aider' | 'windsurf' | null
  ai_detection_method TEXT,               -- 'co_author_trailer' | 'bot_commit' | 'branch_name' | 'cursorrules' | null
  ai_detection_confidence REAL DEFAULT 0, -- 0.0 - 1.0
  
  -- Diff stats (aggregate, not actual code)
  additions INTEGER DEFAULT 0,
  deletions INTEGER DEFAULT 0,
  files_changed INTEGER DEFAULT 0,
  
  -- Meta
  synced_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_commits_sha ON github_commits(commit_sha, profile_id);
CREATE INDEX idx_commits_profile ON github_commits(profile_id, committed_at DESC);
CREATE INDEX idx_commits_ai_tool ON github_commits(ai_tool_detected) WHERE ai_tool_detected IS NOT NULL;
CREATE INDEX idx_commits_date ON github_commits(committed_at DESC);

-- ============================================================
-- PORTFOLIO ITEMS (Self-reported proof-of-work)
-- ============================================================

CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Project details
  title TEXT NOT NULL,
  description TEXT,                       -- What you built, what tools you used
  url TEXT,                               -- Live URL of the project
  screenshot_url TEXT,                    -- Supabase Storage URL
  
  -- Categorization
  category TEXT,                          -- 'landing_page' | 'automation' | 'outbound_system' | 'analytics' | 'app' | 'other'
  tools_used TEXT[] DEFAULT '{}',         -- ['claude_code', 'cursor', 'clay', 'vercel']
  
  -- Verification
  verification_status TEXT DEFAULT 'self_reported',  -- 'self_reported' | 'vouched' | 'verified'
  vouch_count INTEGER DEFAULT 0,
  
  -- Display
  is_pinned BOOLEAN DEFAULT false,        -- Show at top of portfolio
  display_order INTEGER DEFAULT 0,
  
  -- Meta
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_portfolio_profile ON portfolio_items(profile_id, display_order);

-- ============================================================
-- TOOL DECLARATIONS
-- ============================================================

CREATE TABLE tool_declarations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  tool_name TEXT NOT NULL,                -- 'claude_code' | 'cursor' | 'windsurf' | 'copilot' | 'clay' | 'v0' | 'lovable' | 'bolt' | 'replit'
  proficiency TEXT DEFAULT 'user',        -- 'beginner' | 'user' | 'power_user' | 'expert'
  is_verified BOOLEAN DEFAULT false,      -- true if detected in GitHub commits
  verified_commit_count INTEGER DEFAULT 0,
  
  declared_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(profile_id, tool_name)
);

CREATE INDEX idx_tools_profile ON tool_declarations(profile_id);
CREATE INDEX idx_tools_name ON tool_declarations(tool_name);

-- ============================================================
-- VOUCHES (Community endorsements)
-- ============================================================

CREATE TABLE vouches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Who vouched for whom
  voucher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vouchee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Context
  portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE CASCADE,  -- Optional: vouch for a specific project
  message TEXT,                           -- "Worked with them on X, they actually shipped it"
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(voucher_id, vouchee_id),         -- One vouch per person pair
  CHECK(voucher_id != vouchee_id)          -- Can't vouch for yourself
);

CREATE INDEX idx_vouches_vouchee ON vouches(vouchee_id);
CREATE INDEX idx_vouches_voucher ON vouches(voucher_id);

-- ============================================================
-- GITHUB SYNC JOBS
-- ============================================================

CREATE TABLE github_sync_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  status TEXT DEFAULT 'pending',          -- 'pending' | 'running' | 'completed' | 'failed'
  repos_scanned INTEGER DEFAULT 0,
  commits_analyzed INTEGER DEFAULT 0,
  ai_commits_found INTEGER DEFAULT 0,
  
  error_message TEXT,
  
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sync_jobs_profile ON github_sync_jobs(profile_id, created_at DESC);

-- ============================================================
-- EXTERNAL PROOF SOURCES (Vercel, Lovable, Bolt, v0, Replit, etc.)
-- ============================================================
-- These are platform-level proofs that don't come from GitHub.
-- Each source type has its own verification method.
-- This table is designed to be extensible — adding a new platform
-- means adding a new source_type value and a verification function,
-- not a schema migration.

CREATE TABLE external_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- What platform is this proof from?
  source_type TEXT NOT NULL,              -- 'vercel' | 'lovable' | 'bolt' | 'v0' | 'replit' | 'railway' | 'netlify' | 'figma' | 'clay' | 'custom_url'
  
  -- The proof itself
  project_url TEXT NOT NULL,              -- The public URL (e.g. https://my-app.vercel.app, https://lovable.dev/projects/xxx)
  project_name TEXT,                      -- User-provided or auto-detected project name
  
  -- Platform-specific metadata (flexible JSON for different platforms)
  platform_data JSONB DEFAULT '{}',       -- Varies by source_type. Examples below:
  -- vercel:   { "deployments": 47, "last_deployed": "2026-03-15", "framework": "nextjs", "team": null }
  -- lovable:  { "project_id": "xxx", "commits": 23, "public": true, "created_at": "2026-01-10" }
  -- bolt:     { "project_id": "xxx", "forks": 5 }
  -- v0:       { "generation_id": "xxx", "iterations": 12 }
  -- replit:   { "repl_id": "xxx", "runs": 150, "language": "typescript", "forks": 8 }
  -- clay:     { "workflow_name": "Lead Enrichment", "runs": 500, "tables": 3 }
  -- custom_url: { "description": "Landing page I built with Cursor" }
  
  -- Verification
  verification_status TEXT DEFAULT 'pending',  -- 'pending' | 'verified' | 'failed' | 'manual'
  verification_method TEXT,               -- 'dns_check' | 'meta_tag' | 'api_lookup' | 'screenshot' | 'manual_review'
  verified_at TIMESTAMPTZ,
  
  -- For URL-based verification: we check if the URL is live and resolves
  -- For platform-based: we use their public API or page scraping to confirm ownership
  -- For manual: community vouches or admin review
  
  -- Display
  screenshot_url TEXT,                    -- Auto-captured or user-uploaded screenshot
  is_pinned BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  
  -- Scoring
  proof_score INTEGER DEFAULT 0,          -- Calculated based on source_type and verification_status
  -- Scoring weights (applied in calculate.ts):
  -- verified platform proof (Vercel deploy, Lovable project): 20-40 pts each
  -- verified URL (DNS resolves, meta tag confirmed): 15-25 pts each
  -- unverified/pending: 5 pts each
  -- Max contribution to total score: included in portfolio bucket (0-250)
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(profile_id, source_type, project_url)
);

CREATE INDEX idx_external_proofs_profile ON external_proofs(profile_id, display_order);
CREATE INDEX idx_external_proofs_source ON external_proofs(source_type);
CREATE INDEX idx_external_proofs_verified ON external_proofs(verification_status) WHERE verification_status = 'verified';

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouches ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_proofs ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, owner write
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- GitHub commits: only visible in aggregate (via profile), direct access owner-only
CREATE POLICY "Users can view own commits" ON github_commits
  FOR SELECT USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
-- Note: Public profile pages query commits via server-side (service role) to show aggregate stats only

-- Portfolio items: public read, owner write
CREATE POLICY "Portfolio items are viewable by everyone" ON portfolio_items
  FOR SELECT USING (true);
CREATE POLICY "Users can manage own portfolio" ON portfolio_items
  FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Tool declarations: public read, owner write
CREATE POLICY "Tool declarations are viewable by everyone" ON tool_declarations
  FOR SELECT USING (true);
CREATE POLICY "Users can manage own tools" ON tool_declarations
  FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Vouches: public read, voucher can create/delete
CREATE POLICY "Vouches are viewable by everyone" ON vouches
  FOR SELECT USING (true);
CREATE POLICY "Users can create vouches" ON vouches
  FOR INSERT WITH CHECK (voucher_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own vouches" ON vouches
  FOR DELETE USING (voucher_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Sync jobs: owner only
CREATE POLICY "Users can view own sync jobs" ON github_sync_jobs
  FOR SELECT USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- External proofs: public read, owner write
CREATE POLICY "External proofs are viewable by everyone" ON external_proofs
  FOR SELECT USING (true);
CREATE POLICY "Users can manage own external proofs" ON external_proofs
  FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER portfolio_items_updated_at BEFORE UPDATE ON portfolio_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update vouch count on portfolio items
CREATE OR REPLACE FUNCTION update_vouch_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.portfolio_item_id IS NOT NULL THEN
    UPDATE portfolio_items SET vouch_count = vouch_count + 1 WHERE id = NEW.portfolio_item_id;
  ELSIF TG_OP = 'DELETE' AND OLD.portfolio_item_id IS NOT NULL THEN
    UPDATE portfolio_items SET vouch_count = vouch_count - 1 WHERE id = OLD.portfolio_item_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vouches_count_trigger AFTER INSERT OR DELETE ON vouches
  FOR EACH ROW EXECUTE FUNCTION update_vouch_count();
```

---

## GitHub OAuth & AI Detection

### OAuth Flow

```typescript
// lib/github/oauth.ts

// Request 'repo' scope for private repo access + 'read:user' for profile
const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const SCOPES = ['repo', 'read:user'];  // 'repo' gives read access to private repos

export function getGitHubAuthURL(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    scope: SCOPES.join(' '),
    state,
  });
  return `${GITHUB_OAUTH_URL}?${params.toString()}`;
}
```

### AI Tool Detection Rules

```typescript
// lib/github/detect-ai.ts

interface AIDetection {
  tool: string;
  method: string;
  confidence: number;
}

export function detectAITool(commit: GitHubCommit): AIDetection | null {
  const message = commit.commit.message;
  const author = commit.commit.author?.name || '';
  const committer = commit.committer?.login || '';

  // === CLAUDE CODE (100% confidence) ===
  // Claude Code adds: "Co-Authored-By: Claude <noreply@anthropic.com>"
  // and/or: "🤖 Generated with Claude Code"
  if (message.includes('Co-Authored-By: Claude <noreply@anthropic.com>')) {
    return { tool: 'claude_code', method: 'co_author_trailer', confidence: 1.0 };
  }
  if (message.includes('Generated with Claude Code') || message.includes('claude.com/claude-code')) {
    return { tool: 'claude_code', method: 'co_author_trailer', confidence: 1.0 };
  }

  // === GITHUB COPILOT CODING AGENT (100% confidence) ===
  // Copilot's agent commits as 'github-copilot[bot]'
  if (committer === 'github-copilot[bot]' || author === 'github-copilot[bot]') {
    return { tool: 'copilot', method: 'bot_commit', confidence: 1.0 };
  }

  // === AIDER (100% confidence) ===
  // Aider adds: "Co-authored-by: aider (https://aider.chat)"
  if (message.includes('Co-authored-by: aider') || message.includes('aider.chat')) {
    return { tool: 'aider', method: 'co_author_trailer', confidence: 1.0 };
  }

  // === CURSOR (70% confidence) ===
  // No default attribution, but branch names starting with 'cursor-' are indicative
  // Also check for .cursorrules mentions or cursor-specific patterns
  if (commit.commit.tree?.sha) {
    // Check branch ref if available
    const ref = (commit as any)._ref || '';
    if (ref.startsWith('cursor-') || ref.includes('/cursor-')) {
      return { tool: 'cursor', method: 'branch_name', confidence: 0.7 };
    }
  }
  // User-configured Co-Authored-By for Cursor
  if (message.includes('Co-Authored-By: Cursor') || message.includes('cursor.com')) {
    return { tool: 'cursor', method: 'co_author_trailer', confidence: 0.9 };
  }

  // === DEVIN (100% confidence) ===
  if (committer === 'devin-ai-integration[bot]' || author.includes('Devin AI')) {
    return { tool: 'devin', method: 'bot_commit', confidence: 1.0 };
  }

  // === LOVABLE / BOLT / V0 (varies) ===
  if (committer === 'lovable[bot]' || message.includes('lovable.dev')) {
    return { tool: 'lovable', method: 'bot_commit', confidence: 1.0 };
  }

  return null;
}
```

### GitHub Sync Pipeline

```typescript
// lib/github/sync.ts

export async function syncGitHubData(profileId: string, accessToken: string) {
  // 1. Fetch all repos (including private)
  const repos = await fetchAllRepos(accessToken);
  
  // 2. For each repo, fetch recent commits (last 6 months)
  for (const repo of repos) {
    const commits = await fetchCommits(accessToken, repo.full_name, {
      since: sixMonthsAgo(),
      author: repo.owner.login, // Only user's own commits
    });
    
    // 3. For each commit, run AI detection
    for (const commit of commits) {
      const detection = detectAITool(commit);
      
      // 4. Store commit data (minimal — no code content)
      await storeCommit({
        profile_id: profileId,
        commit_sha: commit.sha,
        repo_full_name: repo.full_name,
        repo_is_private: repo.private,
        commit_message: repo.private ? '[private]' : commit.commit.message.split('\n')[0], // First line only, redact private
        committed_at: commit.commit.author.date,
        ai_tool_detected: detection?.tool || null,
        ai_detection_method: detection?.method || null,
        ai_detection_confidence: detection?.confidence || 0,
        additions: commit.stats?.additions || 0,
        deletions: commit.stats?.deletions || 0,
        files_changed: commit.files?.length || 0,
      });
    }
  }
  
  // 5. Auto-verify tool declarations based on detected commits
  await autoVerifyTools(profileId);
  
  // 6. Recalculate GTM Commit Score
  await recalculateScore(profileId);
}
```

---

## External Proof Verification (Vercel, Lovable, Bolt, v0, Replit, etc.)

Users who build with Lovable, Bolt, v0, Replit, or deploy to Vercel/Netlify may never touch git directly. Their proof-of-work lives in platform project URLs and deployment histories, not commit messages. This system verifies those proofs.

### How It Works

1. User adds a project URL (e.g. `https://my-landing-page.vercel.app` or `https://lovable.dev/projects/abc123`)
2. System auto-detects the platform from the URL pattern
3. Platform-specific verifier runs (see below)
4. Verification status and platform metadata stored in `external_proofs` table
5. Verified proofs contribute to the portfolio score bucket (0-250 points)

### Platform Detection & Verification

```typescript
// lib/proofs/verify.ts

interface ProofVerification {
  source_type: string;
  verification_status: 'verified' | 'failed' | 'pending';
  verification_method: string;
  platform_data: Record<string, any>;
  screenshot_url?: string;
}

// Auto-detect platform from URL
export function detectPlatform(url: string): string {
  const patterns: [RegExp, string][] = [
    [/\.vercel\.app/i, 'vercel'],
    [/vercel\.com\/.*\/deployments/i, 'vercel'],
    [/lovable\.dev\/projects/i, 'lovable'],
    [/lovable\.app/i, 'lovable'],
    [/bolt\.new/i, 'bolt'],
    [/stackblitz\.com/i, 'bolt'],           // Bolt uses StackBlitz
    [/v0\.dev/i, 'v0'],
    [/replit\.com\/@/i, 'replit'],
    [/repl\.co/i, 'replit'],
    [/\.railway\.app/i, 'railway'],
    [/\.netlify\.app/i, 'netlify'],
    [/\.fly\.dev/i, 'fly'],
    [/figma\.com\/file/i, 'figma'],
    [/figma\.com\/design/i, 'figma'],
  ];

  for (const [pattern, platform] of patterns) {
    if (pattern.test(url)) return platform;
  }
  return 'custom_url';  // Fallback: generic URL verification
}

// Dispatch to platform-specific verifier
export async function verifyProof(url: string): Promise<ProofVerification> {
  const platform = detectPlatform(url);
  
  switch (platform) {
    case 'vercel':   return await verifyVercel(url);
    case 'lovable':  return await verifyLovable(url);
    case 'replit':   return await verifyReplit(url);
    case 'bolt':     return await verifyBolt(url);
    case 'v0':       return await verifyV0(url);
    default:         return await verifyGenericURL(url);
  }
}
```

### Platform-Specific Verifiers

```typescript
// lib/proofs/vercel.ts
// Vercel deployments are publicly accessible — check if URL resolves
// and extract deployment metadata from response headers
export async function verifyVercel(url: string): Promise<ProofVerification> {
  const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
  
  return {
    source_type: 'vercel',
    verification_status: response.ok ? 'verified' : 'failed',
    verification_method: 'dns_check',
    platform_data: {
      http_status: response.status,
      server: response.headers.get('server'),           // 'Vercel'
      x_vercel_id: response.headers.get('x-vercel-id'), // Confirms it's on Vercel
      framework: response.headers.get('x-matched-path') ? 'nextjs' : 'unknown',
    },
  };
}

// lib/proofs/lovable.ts
// Lovable projects have public pages at lovable.dev/projects/[id]
// Check if the page exists and extract project metadata
export async function verifyLovable(url: string): Promise<ProofVerification> {
  const response = await fetch(url);
  if (!response.ok) return { source_type: 'lovable', verification_status: 'failed', verification_method: 'api_lookup', platform_data: {} };
  
  // Lovable project pages contain metadata we can extract
  const html = await response.text();
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  
  return {
    source_type: 'lovable',
    verification_status: 'verified',
    verification_method: 'api_lookup',
    platform_data: {
      project_title: titleMatch?.[1] || 'Unknown',
      public: true,
    },
  };
}

// lib/proofs/url.ts
// Generic URL verification: confirm the URL is live, capture metadata
export async function verifyGenericURL(url: string): Promise<ProofVerification> {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return {
      source_type: 'custom_url',
      verification_status: response.ok ? 'verified' : 'failed',
      verification_method: 'dns_check',
      platform_data: {
        http_status: response.status,
        content_type: response.headers.get('content-type'),
        server: response.headers.get('server'),
      },
    };
  } catch {
    return { source_type: 'custom_url', verification_status: 'failed', verification_method: 'dns_check', platform_data: { error: 'unreachable' } };
  }
}
```

### Scoring Integration

External proofs feed into the **portfolio score bucket** (0-250 points) alongside manually added portfolio items:

```typescript
// In lib/scoring/calculate.ts — add to portfolio calculation:

// Verified external proofs (max 100 pts, included within portfolio's 250 cap)
const verifiedProofs = data.externalProofs.filter(p => p.verification_status === 'verified');
const platformProofs = verifiedProofs.filter(p => p.source_type !== 'custom_url');
const urlProofs = verifiedProofs.filter(p => p.source_type === 'custom_url');

// Platform-verified (Vercel, Lovable, etc.) = 25 pts each, max 75
portfolio += Math.min(75, platformProofs.length * 25);

// URL-verified (generic live URL) = 15 pts each, max 45  
portfolio += Math.min(45, urlProofs.length * 15);

// Unverified proofs = 5 pts each, max 20
const unverifiedProofs = data.externalProofs.filter(p => p.verification_status === 'pending');
portfolio += Math.min(20, unverifiedProofs.length * 5);
```

### UI: Adding External Proofs (Dashboard)

The portfolio management page should include an "Add Proof" flow:

1. User pastes a URL
2. System auto-detects the platform and shows the platform icon/badge
3. "Verify" button triggers the verification API
4. On success: shows green checkmark, platform badge, and extracted metadata
5. On failure: shows option to retry or submit for manual review

Supported platforms should be displayed as clickable icons:
`Vercel · Lovable · Bolt · v0 · Replit · Railway · Netlify · Figma · Custom URL`

### Future Expansion (v2+)

This architecture is designed to be extended without schema changes:

- **Clay integration:** When Clay releases a public API, add `lib/proofs/clay.ts` to verify workflow ownership and pull run counts. Until then, users add Clay workspace screenshots as portfolio items.
- **Cursor telemetry:** If Cursor ever exposes usage analytics, add `lib/proofs/cursor.ts`. For now, Cursor users who push to GitHub get detected via the GitHub pipeline.
- **Zapier/Make.com:** Workflow automation platforms could be verified via public shared workflow URLs.
- **Notion:** Public Notion pages as documentation proof.
- **OAuth-based verification (v2):** Instead of URL scraping, integrate OAuth with Vercel, Replit, etc. to pull deployment history directly. This gives richer data but requires partnership/API access.

---

## GTM Commit Score Algorithm

```typescript
// lib/scoring/calculate.ts

interface ScoreBreakdown {
  github: number;       // 0-500 points
  portfolio: number;    // 0-250 points
  vouches: number;      // 0-150 points
  tools: number;        // 0-100 points
  total: number;        // 0-1000 points
}

export function calculateGtmCommitScore(data: ProfileData): ScoreBreakdown {
  
  // === GITHUB SCORE (0-500) — Highest weight, verified proof ===
  let github = 0;
  
  // AI-assisted commits (max 300 points)
  // Logarithmic scale: first commits worth more, diminishing returns
  const aiCommits = data.commits.filter(c => c.ai_tool_detected).length;
  github += Math.min(300, Math.round(100 * Math.log2(aiCommits + 1)));
  
  // Tool diversity bonus (max 100 points) — using multiple AI tools shows adaptability
  const uniqueTools = new Set(data.commits.filter(c => c.ai_tool_detected).map(c => c.ai_tool_detected));
  github += Math.min(100, uniqueTools.size * 25);
  
  // Consistency bonus (max 100 points) — commits spread across weeks, not one burst
  const activeWeeks = countActiveWeeks(data.commits);
  github += Math.min(100, activeWeeks * 5);
  
  // === PORTFOLIO SCORE (0-250) — Self-reported but endorsable ===
  let portfolio = 0;
  
  // Portfolio items (max 150 points)
  portfolio += Math.min(150, data.portfolioItems.length * 30);
  
  // Vouched items worth more (max 100 points)
  const vouchedItems = data.portfolioItems.filter(p => p.vouch_count > 0);
  portfolio += Math.min(100, vouchedItems.length * 25);
  
  // === VOUCH SCORE (0-150) — Community endorsement ===
  let vouches = 0;
  
  // Unique vouchers (max 150 points)
  // Each unique person who vouches for you = 15 points (max 10 vouchers)
  vouches += Math.min(150, data.vouchCount * 15);
  
  // === TOOL SCORE (0-100) — Declared tools ===
  let tools = 0;
  
  // Verified tools (detected in commits) worth 20 each, max 60
  const verifiedTools = data.toolDeclarations.filter(t => t.is_verified);
  tools += Math.min(60, verifiedTools.length * 20);
  
  // Self-declared tools worth 5 each, max 40
  const declaredOnly = data.toolDeclarations.filter(t => !t.is_verified);
  tools += Math.min(40, declaredOnly.length * 5);
  
  const total = github + portfolio + vouches + tools;
  
  return { github, portfolio, vouches, tools, total };
}

// === TIER MAPPING ===
export function scoreToTier(score: number): string {
  if (score >= 750) return 'legend';     // 🏆 Top tier
  if (score >= 500) return 'captain';    // 🚀 Strong
  if (score >= 250) return 'builder';    // 🔨 Getting there
  if (score >= 50)  return 'shipper';    // 📦 Just started
  return 'unranked';                      // No proof yet
}
```

---

## OG Image Generation

```typescript
// app/api/og/[username]/route.tsx

import { ImageResponse } from '@vercel/og';

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const profile = await getPublicProfile(params.username);
  if (!profile) return new Response('Not found', { status: 404 });
  
  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '1200px',
        height: '630px',
        background: '#ffffff',
        padding: '60px',
        fontFamily: 'sans-serif',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src={profile.avatar_url} width="80" height="80" style={{ borderRadius: '50%' }} />
          <div>
            <div style={{ color: '#1f2937', fontSize: '36px', fontWeight: 700 }}>{profile.display_name}</div>
            <div style={{ color: '#6b7280', fontSize: '20px' }}>@{profile.username} · {profile.role}</div>
          </div>
        </div>
        
        {/* Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginTop: '40px' }}>
          <div style={{
            background: '#10b981',
            color: '#ffffff',
            fontSize: '72px',
            fontWeight: 800,
            padding: '20px 40px',
            borderRadius: '20px',
          }}>
            {profile.gtmcommit_score}
          </div>
          <div style={{ color: '#1f2937', fontSize: '24px' }}>
            GTM Commit Score · {profile.gtmcommit_tier.toUpperCase()}
          </div>
        </div>
        
        {/* Footer */}
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ color: '#9ca3af', fontSize: '18px' }}>gtmcommit.com/{profile.username}</div>
          <div style={{ color: '#9ca3af', fontSize: '18px' }}>Talk is cheap. Commits aren't.</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

---

## Environment Variables

```bash
# .env.local.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# GitHub OAuth App
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=GTM Commit

# Resend (email)
RESEND_API_KEY=re_your-key

# PostHog (analytics)
NEXT_PUBLIC_POSTHOG_KEY=phc_your-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## Landing Page — Full Copy (implement exactly as written)

The landing page follows Marc Lou's proven conversion architecture. All copy below is final — implement it verbatim. The entire landing page is a single scrollable page at the root route `/`.

### Section 1: HERO

**Layout:** Full viewport height. Dark background. Centered content. Animated profile card floats to the right on desktop, stacks below on mobile.

**Headline (h1):**
```
Talk is cheap. Commits aren't.
```

**Subhead (p, muted):**
```
The proof-of-work network for AI-native GTM professionals.
Connect GitHub. Show what you've shipped. Get your GTM Commit.
```

**Primary CTA button (large, green/accent):**
```
Get Your GTM Commit →
```
Links to GitHub OAuth flow.

**Social proof line (small, below CTA):**
```
Join [X] builders who prove they ship — not just talk.
```
`[X]` is a live count from the profiles table. Use `0` initially, then "the first" instead of "Join 0".

**Right side visual:** An animated mock ProfileCard component showing:
- Avatar, name "Sarah Chen", role "Growth Engineer"
- GTM Commit Score: 724 (Captain tier)
- Tool badges: Claude Code (verified), Cursor (verified), Clay
- Mini heatmap showing commit activity
- "Powered by GTM Commit" badge at bottom

This mock card should use real components (ProfileCard, ToolBadges, etc.) with hardcoded data so visitors see exactly what their profile will look like.

---

### Section 2: THE PROBLEM

**Section headline (h2):**
```
Everyone claims they're AI-native.
Who's actually shipping?
```

**Layout:** Three cards side by side on desktop, stacked on mobile.

**Card 1 — "The Talker" (red/danger accent):**
```
Title: The Talker
- Lists "AI Tools" in LinkedIn skills
- Shares ChatGPT screenshots
- Says "I use Claude" in interviews
- Zero commits. Zero shipped projects.
- Proof: ❌ None
```

**Card 2 — "The Doer" (green/success accent):**
```
Title: The Doer
- 47 Claude Code commits this quarter
- Shipped 3 landing pages from terminal
- Built outbound automation in Cursor
- Clay workflows generating pipeline
- Proof: ✅ Verified on GitHub
```

**Card 3 — "The GTM Commit Profile" (accent/primary, slightly elevated):**
```
Title: The GTM Commit Profile
- Auto-detects AI commits from GitHub
- Verifies Claude Code, Cursor, Copilot usage
- Portfolio of shipped projects
- Peer vouches from other builders
- Score: 724 / 1000 — Captain
```

---

### Section 3: HOW IT WORKS

**Section headline (h2):**
```
Three steps. Two minutes. Permanent proof.
```

**Layout:** Three numbered steps, horizontal on desktop, vertical on mobile. Each step has an icon, title, and description.

**Step 1:**
```
Icon: 🔗 (or GitHub logo)
Title: Connect GitHub
Body: We scan your commits for AI tool signatures — Claude Code, Copilot, Cursor, Aider, and more. Private repo data stays private. We only count the commits, never store code.
```

**Step 2:**
```
Icon: 🛠️
Title: Build Your Profile
Body: Add your shipped projects, declare your tools, write your bio. Other builders can vouch for your work. The more proof, the higher your score.
```

**Step 3:**
```
Icon: 🚀
Title: Share Your GTM Commit
Body: Your profile at gtmcommit.com/username is your verifiable credential. Drop it in your LinkedIn bio, Twitter, job applications. Let the commits speak for themselves.
```

---

### Section 4: SCORE BREAKDOWN

**Section headline (h2):**
```
Your GTM Commit Score: 0 to 1,000
```

**Subhead:**
```
Weighted by verification level. Verified proof from GitHub counts the most. Self-reported claims count the least. That's the point.
```

**Layout:** Four horizontal bars or cards showing the scoring breakdown.

```
GitHub Commits — up to 500 pts
Auto-detected AI tool usage from your commit history. Highest weight because it's verified and unfakeable.

Portfolio Projects — up to 250 pts
Shipped work you can show. URLs, screenshots, walkthroughs. Community-vouched projects score higher.

Peer Vouches — up to 150 pts
Other GTM Commit members endorse your work. One vouch per person. You can't vouch for yourself.

Tool Declarations — up to 100 pts
Self-declared tools you use. Lowest weight. Verified automatically if detected in your commits.
```

**Tier badges (displayed below):**
```
📦 Shipper (50-249) → 🔨 Builder (250-499) → 🚀 Captain (500-749) → 🏆 Legend (750+)
```

---

### Section 5: FEATURED PROFILES

**Section headline (h2):**
```
Builders who prove they ship
```

**Layout:** Grid of 3-6 ProfileCard components (responsive: 3 cols desktop, 2 tablet, 1 mobile). Pulled from database where `is_featured = true`. Each card is clickable, links to the public profile page.

**If no featured profiles exist yet (launch state):** Show 3 placeholder cards with a message:
```
Be one of the first builders to get verified.
Early profiles get featured on the homepage.
```

**Below the grid:**
```
View Full Leaderboard →
```
Links to /leaderboard (public, no auth required).

---

### Section 6: PRIVACY COMMITMENT

**Section headline (h2):**
```
Your code stays yours. We just count the commits.
```

**Layout:** Icon + text list, clean and simple.

```
🔒 We never store source code — only commit metadata (timestamp, diff stats, AI tool detection)
🙈 Private repo names are never displayed — we show "47 commits across 3 private repos," not repo names
🗑️ Disconnect anytime — all your commit data is deleted immediately
🔍 Transparent by design — read our privacy policy to see exactly what we collect
```

---

### Section 7: FINAL CTA

**Layout:** Full-width section with centered content. Accent background or gradient.

**Headline (h2):**
```
What's your GTM Commit?
```

**Subhead:**
```
Free to start. Takes 2 minutes.
Stop telling people you're AI-native. Show them.
```

**CTA button (large, same style as hero):**
```
Connect GitHub & Get Scored →
```

---

### FOOTER

**Layout:** Simple footer with links and branding.

**Left:** GTM Commit logo + tagline "Talk is cheap. Commits aren't."

**Center links:** About · Leaderboard · GitHub · Twitter

**Right:** "Built with Claude Code by @AnkurShrestha"

**Bottom line (very small):**
```
© 2026 GTM Commit. All rights reserved.
```

---

## DaisyUI Theme & Design Direction

### Design Philosophy

**The profile must be something a marketer proudly drops in a LinkedIn post.** Not a developer terminal. Not corporate SaaS. Think Spotify Wrapped meets Peerlist meets a high-end portfolio — clean, polished, professional, but with enough personality to feel special.

The target user is a growth marketer or SDR who uses Claude Code and Cursor but doesn't identify as a developer. Their profile should make them look impressive to hiring managers, founders, and peers. If someone's mom looks at it and thinks "that looks legit," we nailed it.

### Visual References
- **Peerlist profiles** — clean white/light backgrounds, professional but not boring
- **Spotify Wrapped cards** — bold colors, big numbers, designed to be screenshotted and shared
- **Marc Lou's IndiePage** — DaisyUI stock components, minimal custom CSS, punchy and fast
- **Linear app** — subtle gradients, refined spacing, premium feel without being stuffy

### Theme Configuration

Use DaisyUI's built-in `lofi` theme as the base (clean, light, professional) with a custom accent palette. Support both light (default) and dark modes via DaisyUI's theme switcher.

```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {},  // Lean on DaisyUI defaults — don't fight the framework
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        gtmcommit: {
          'primary': '#10b981',           // Emerald green — the GTM Commit color. Scores, verified badges, CTAs.
          'primary-content': '#ffffff',
          'secondary': '#6366f1',         // Indigo — tier badges, secondary actions
          'secondary-content': '#ffffff',
          'accent': '#f59e0b',            // Amber — highlights, attention, "Legend" tier
          'accent-content': '#ffffff',
          'neutral': '#1f2937',           // Dark text
          'neutral-content': '#f9fafb',
          'base-100': '#ffffff',          // White background — clean, shareable
          'base-200': '#f9fafb',          // Light gray — card backgrounds
          'base-300': '#e5e7eb',          // Borders, dividers
          'base-content': '#1f2937',      // Dark text on light backgrounds
          'info': '#3b82f6',
          'success': '#10b981',
          'warning': '#f59e0b',
          'error': '#ef4444',
        },
      },
      'night',  // Dark mode alternative — users can toggle
    ],
  },
};
```

### Typography

Use DaisyUI's default font stack — don't override with custom fonts. DaisyUI uses the system font stack which renders beautifully on every device and loads instantly (zero FOIT). This is what Marc Lou does across all his products.

The only exception: if a display font is needed for the hero headline ("Talk is cheap. Commits aren't."), use `next/font/google` to load **DM Sans** (bold, modern, friendly) or **Outfit** (geometric, clean). Apply only to h1 elements, not globally.

### Component Patterns

Lean heavily on stock DaisyUI components — this is what makes Marc Lou's products look good with minimal effort:

- **`stat`** — For GTM Commit Score display (big number, label, description)
- **`card`** — For profile cards, portfolio items, leaderboard entries
- **`badge`** — For tool badges (Claude Code, Cursor, etc.) and tier badges (Shipper, Builder, Captain, Legend)
- **`avatar`** — For profile pictures with online/verified indicators
- **`progress`** — For score breakdown bars (GitHub: 450/500, Portfolio: 200/250, etc.)
- **`tooltip`** — For explaining what each score component means
- **`btn`** — Primary CTA buttons. Use `btn-primary btn-lg` for main CTAs.
- **`hero`** — For the landing page hero section
- **`steps`** — For the "How It Works" section
- **`footer`** — For the footer

### Profile Card (The Viral Unit)

The ProfileCard component is the single most important visual element — it's what gets shared on LinkedIn and Twitter. Design it to be:

1. **Self-contained** — Looks complete and impressive without any surrounding page context
2. **Screenshot-worthy** — Clean enough to screenshot on mobile and share as an image
3. **Branded** — "gtmcommit.com/username" visible on the card itself (not just in the URL bar)
4. **Colorful but professional** — Use the emerald green for the score, indigo for tier, amber for Legend tier. White background so it pops on any social media feed.

**Card layout (top to bottom):**
- Avatar + Name + Role + Company (one line)
- GTM Commit Score (large number) + Tier badge
- Score breakdown mini-bars (GitHub / Portfolio / Vouches / Tools)
- Tool badges row (verified tools get a checkmark overlay)
- "gtmcommit.com/username" + Powered by GTM Commit (bottom)

### OG Image

The OG image (for social sharing) should match the profile card design but optimized for 1200x630px. Light background (white/off-white), bold score number, clean typography. This is what appears when someone pastes their profile URL into LinkedIn, Twitter, or Slack — it needs to look premium.

### Key Design Rules

1. **Light mode by default.** Dark mode as a toggle option. Light profiles share better on social media (higher contrast in feed thumbnails).
2. **No monospace fonts.** These signal "developer tool." We're building for marketers who code, not coders who market.
3. **Big numbers.** The score should be the visual anchor of every profile — large, bold, colored. Like a credit score or a game rank.
4. **Generous whitespace.** Let the content breathe. Cramped profiles don't get shared.
5. **Verified checkmarks are emerald green.** Self-reported items are gray. The visual hierarchy of trust should be immediately obvious.

---

## Sprint Plan

### Day 1: Foundation + GitHub Integration
- [ ] Initialize Next.js project with App Router
- [ ] Configure Tailwind CSS + DaisyUI theme (light mode default, clean professional aesthetic, dark toggle)
- [ ] Set up Supabase project, apply schema migration
- [ ] Implement Supabase Auth with GitHub OAuth provider
- [ ] Build GitHub OAuth flow with `repo` + `read:user` scopes
- [ ] Implement GitHub API client (fetch repos, commits)
- [ ] Build AI tool detection engine (detect-ai.ts)
- [ ] Build sync pipeline (fetch → detect → store → score)
- [ ] Create GTM Commit Score calculation engine
- [ ] Test end-to-end: login with GitHub → sync commits → see score in DB

### Day 2: Profile Pages + Landing Page
- [ ] Build public profile page ([username]/page.tsx) — THE viral page
- [ ] Build ProfileCard component (score, tier badge, heatmap, tools)
- [ ] Build PortfolioGrid + PortfolioItem components
- [ ] Build VouchSection component
- [ ] Implement "Powered by GTM Commit" badge (free tier)
- [ ] Build OG image generation (api/og/[username])
- [ ] Build landing page (Hero, Problem, HowItWorks, FeaturedProfiles, CTA)
- [ ] Build leaderboard page (/leaderboard) — public, no auth
- [ ] Build leaderboard API with caching

### Day 3: Dashboard + Polish + Deploy
- [ ] Build authenticated dashboard (your score, sync status, profile preview)
- [ ] Build profile edit page (bio, links, tools, avatar)
- [ ] Build portfolio management (add/edit/delete portfolio items)
- [ ] Build vouch system (vouch for other profiles)
- [ ] Implement share functionality (copy URL, share to Twitter/LinkedIn)
- [ ] Add PostHog analytics
- [ ] Deploy to Vercel
- [ ] Set up private GitHub repo
- [ ] Seed 3-5 beta profiles (your own + friends)
- [ ] Write launch tweet / LinkedIn post

### Post-Sprint (Week 2+)
- [ ] Weekly GitHub re-sync (cron job)
- [ ] Email notifications (Resend): welcome, weekly digest, vouch received
- [ ] Profile completeness nudges
- [ ] Stripe integration for Pro tier (badge removal, custom domain)
- [ ] Embeddable profile card (script tag for personal sites)
- [ ] Community Slack/Discord integration
- [ ] Programmatic SEO pages (gtmcommit.com/tools/claude-code, gtmcommit.com/roles/gtm-engineer)

---

## Privacy & Trust Contract

This is critical for adoption — users are giving us access to private repos:

1. **We NEVER store source code.** Only commit metadata: SHA, timestamp, message (first line only, redacted for private repos), diff stats (additions/deletions), and AI tool detection result.
2. **Private repo names are NEVER displayed publicly.** We show aggregate stats ("47 AI commits across 3 private repos") but never the repo name or commit message.
3. **Users can disconnect GitHub at any time.** This deletes all stored commit data immediately.
4. **GitHub tokens are encrypted at rest** and never exposed via any API endpoint.
5. **Transparent by design.** Our privacy policy details exactly what data we collect and how.

---

## Competitive Positioning

| Platform | Proof-of-work? | AI-specific? | GTM focus? | Profile as credential? |
|---|---|---|---|---|
| **GTM Commit** | ✅ GitHub + Portfolio + Vouches | ✅ Claude Code/Cursor/Copilot detection | ✅ Marketers, SDRs, AEs | ✅ gtmcommit.com/username |
| Peerlist | ✅ GitHub/Dribbble/PH | ❌ | ❌ Dev/designer | ✅ peerlist.io/username |
| LinkedIn | ❌ Self-reported | ❌ | ❌ Everyone | ❌ Not proof-based |
| OpenAI Jobs | Partial (certs) | ✅ | ❌ Broad workforce | ❌ Not launched |
| Fueler | ✅ Portfolio | ❌ | ❌ General | ✅ fueler.io/username |
| IndiePage | ✅ Stripe revenue | ❌ | ❌ Indie hackers | ✅ indiepa.ge/username |

**GTM Commit's unique wedge:** The ONLY platform that verifies AI coding tool usage specifically for GTM professionals. No one else detects Claude Code commits and maps them to a marketer's profile.

---

## Key Design Decisions

1. **Light mode by default.** Clean, professional, shareable. Dark mode available as toggle. Light profiles pop on LinkedIn and Twitter feeds.
2. **Profile cards designed for screenshots.** Every profile generates a visual worth posting. White background, bold score, clean layout — looks premium in any social feed.
3. **Score is prominent.** The number IS the product. Large, bold, emerald green. Like a credit score for AI-native builders.
4. **Open source (MIT).** Released as open source to invite community contribution and signal "we ship what we preach." Trust is established through a clear privacy policy, transparent data practices, AND open source code.
5. **No email signup.** GitHub OAuth only. This IS the filter — if you don't have GitHub, the core value prop doesn't apply to you. (Future: add Google OAuth for portfolio-only profiles.)
6. **Professional, not developer-y.** No monospace fonts, no terminal aesthetics. The user is a marketer who uses Claude Code, not a developer who does marketing. The design should make non-technical people look impressive.

---

## Sources & Inspiration

- [Marc Lou's ShipFast](https://shipfa.st/) — Next.js + DaisyUI boilerplate, landing page architecture
- [Marc Lou's IndiePage](https://indiepa.ge/) — Viral profile builder model (9,895 pages, $10M+ verified revenue)
- [Marc Lou's TrustMRR](https://trustmrr.com/) — Verified revenue leaderboard (35K visitors in 48 hours)
- [Peerlist](https://peerlist.io/) — Proof-of-work professional network (20K+ verified users)
- [Coderbuds AI Detection Rules](https://coderbuds.com/blog/open-source-ai-code-detection-yaml-rules) — YAML-based AI commit detection
- [Linktree PLG Model](https://foundationinc.co/lab/linktree-product-led-marketing/) — Branded URL viral loop at scale
- [HireAHuman](https://hire-a-human.app/) — GitHub "Reality Score" concept validation
