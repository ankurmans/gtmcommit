# PROOF-TYPES.md — Complete GTM Commit Proof-of-Work System

## Overview

GTM Commit accepts proof from any source where someone demonstrates they actually use AI tools for GTM work. The system is designed to be source-agnostic — what matters is the confidence level of the verification, not where the proof comes from.

This document defines every proof type, how it's verified, how it scores, and the schema to support it.

---

## Proof Type Registry

### Category 1: Platform-Connected Proofs (Auto-Verified)

These require the user to connect an account or provide a URL that the system can verify programmatically.

| Proof Type | How User Adds It | Verification Method | Tier | Points |
|---|---|---|---|---|
| GitHub AI Commits | Connect GitHub OAuth | Commit trailer/author detection | Tier 1 | Up to 200 |
| Vercel Deployment | Paste URL | HTTP HEAD + `x-vercel-id` header | Tier 1 | 30 each, cap 150 |
| Lovable Project | Paste URL | Public project page scrape | Tier 1 | 30 each, cap 150 |
| Replit Repl | Paste URL | Public repl page, run/fork count | Tier 1 | 30 each, cap 150 |
| Bolt.new Project | Paste URL | StackBlitz project detection | Tier 1 | 30 each, cap 150 |
| v0.dev Generation | Paste URL | v0.dev page validation | Tier 1 | 30 each, cap 150 |
| Railway Deployment | Paste URL | HTTP HEAD + `railway` headers | Tier 1 | 30 each, cap 150 |
| Netlify Deployment | Paste URL | HTTP HEAD + `netlify` headers | Tier 1 | 30 each, cap 150 |
| GitHub Agent Repos | Auto-detected during sync | Presence of CLAUDE.md, MCP config, skills | Tier 1 | 40 each, cap 120 |

**Combined cap for all platform deployments: 150 pts** (prevents gaming by deploying to every platform)

---

### Category 2: Video Proof (High-Trust Self-Reported)

Screen recordings are the hardest proof to fake. A video showing someone prompting Claude Code, iterating in Cursor, or building a Clay workflow is near-undeniable evidence of proficiency.

| Proof Type | How User Adds It | Verification Method | Tier | Points |
|---|---|---|---|---|
| Workflow Walkthrough | Paste Loom/YouTube URL | URL validation + duration check | Tier 2 (with vouches) / Tier 3 (without) | 20-35 each |
| Tool Demo | Paste Loom/YouTube URL | URL validation + duration check | Tier 2 (with vouches) / Tier 3 (without) | 15-25 each |
| Build Session Recording | Paste Loom/YouTube URL | URL validation + duration check | Tier 2 (with vouches) / Tier 3 (without) | 25-40 each |

**Video Proof Rules:**
- Accepted platforms: Loom, YouTube, Vimeo (URLs validated against known patterns)
- Minimum duration: 30 seconds (rejects screenshot-converted-to-video gaming)
- Maximum points per video: 40 pts (Tier 2 with vouches) / 20 pts (Tier 3 without)
- Video cap: 5 videos count toward score, max 150 pts from video proof
- Videos must be public/unlisted (not private — system must be able to verify URL resolves)

**Video Metadata Extraction:**
```typescript
interface VideoProof {
  url: string;
  platform: 'loom' | 'youtube' | 'vimeo';
  duration_seconds: number;       // Extracted from oEmbed or page metadata
  title: string;                  // Auto-extracted
  thumbnail_url: string;          // For display on profile
  tools_mentioned: string[];      // Parsed from title/description: ['claude_code', 'cursor', 'clay']
}

async function validateVideoProof(url: string): Promise<VideoProof | null> {
  // Detect platform
  const platform = detectVideoPlatform(url);
  if (!platform) return null;
  
  // Fetch oEmbed data for metadata
  const oembedUrl = getOEmbedUrl(platform, url);
  const metadata = await fetch(oembedUrl).then(r => r.json());
  
  // Duration check
  if (metadata.duration && metadata.duration < 30) return null;
  
  // Extract tool mentions from title/description
  const tools = detectToolMentions(metadata.title + ' ' + (metadata.description || ''));
  
  return {
    url,
    platform,
    duration_seconds: metadata.duration || 0,
    title: metadata.title,
    thumbnail_url: metadata.thumbnail_url,
    tools_mentioned: tools,
  };
}

function detectVideoPlatform(url: string): string | null {
  if (/loom\.com\/share/i.test(url)) return 'loom';
  if (/youtube\.com\/watch|youtu\.be/i.test(url)) return 'youtube';
  if (/vimeo\.com\/\d+/i.test(url)) return 'vimeo';
  return null;
}

function getOEmbedUrl(platform: string, url: string): string {
  switch (platform) {
    case 'loom': return `https://www.loom.com/v1/oembed?url=${encodeURIComponent(url)}`;
    case 'youtube': return `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    case 'vimeo': return `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
    default: return '';
  }
}
```

---

### Category 3: Published Content Proof

Blog posts, Twitter threads, LinkedIn posts, and newsletter articles where someone documents their AI-native GTM work with real examples, code snippets, or workflow breakdowns.

| Proof Type | How User Adds It | Verification Method | Tier | Points |
|---|---|---|---|---|
| Blog Post / Article | Paste URL | URL validation + content length check | Tier 3 (Tier 2 with vouches) | 15-30 each |
| Twitter/X Thread | Paste URL | URL validation + thread detection | Tier 3 (Tier 2 with vouches) | 10-20 each |
| LinkedIn Post | Paste URL | URL validation | Tier 3 (Tier 2 with vouches) | 10-20 each |
| Newsletter Issue | Paste URL (Substack, Beehiiv, etc.) | URL validation | Tier 3 (Tier 2 with vouches) | 15-25 each |
| GitHub README / Guide | Paste URL | GitHub URL validation | Tier 3 (Tier 2 with vouches) | 15-25 each |

**Content Proof Rules:**
- URL must resolve (HTTP 200)
- Content must be authored by the user (honor system + vouch layer)
- Maximum 8 content pieces count toward score
- Cap: 100 pts from content proof
- Content must be related to AI-native GTM work (detected via keyword matching in title/description, not enforced rigidly)

**Content Metadata Extraction:**
```typescript
interface ContentProof {
  url: string;
  platform: 'blog' | 'twitter' | 'linkedin' | 'substack' | 'beehiiv' | 'medium' | 'github' | 'other';
  title: string;
  published_at: string | null;
  estimated_word_count: number;
  tools_mentioned: string[];
}

function detectContentPlatform(url: string): string {
  if (/twitter\.com|x\.com/i.test(url)) return 'twitter';
  if (/linkedin\.com\/posts/i.test(url)) return 'linkedin';
  if (/substack\.com/i.test(url)) return 'substack';
  if (/beehiiv\.com/i.test(url)) return 'beehiiv';
  if (/medium\.com/i.test(url)) return 'medium';
  if (/github\.com.*readme/i.test(url)) return 'github';
  return 'other';
}
```

---

### Category 4: Certifications (Third-Party Validated)

External certifications from recognized platforms that validate AI or GTM tool proficiency.

| Certification Source | How User Adds It | Verification Method | Tier | Points |
|---|---|---|---|---|
| OpenAI Certification | Paste Credly badge URL or cert ID | Credly API or URL validation | Tier 1 | 40 each |
| Clay Certification | Paste cert URL | URL validation against clay.com domain | Tier 1 | 30 each |
| HubSpot AI Certification | Paste cert URL | URL validation against hubspot.com | Tier 2 | 20 each |
| GTM AI Academy Completion | Paste cert URL | URL validation | Tier 2 | 20 each |
| Pavilion AI in GTM School | Paste cert URL | URL validation | Tier 2 | 20 each |
| Product Marketing Alliance AI Cert | Paste cert URL | URL validation | Tier 2 | 15 each |
| Other Recognized Cert | Paste cert URL + name | Manual review or vouch | Tier 3 | 10 each |

**Certification Rules:**
- Recognized certs (OpenAI, Clay) are auto-verified via URL pattern matching against known cert page domains
- Unrecognized certs require 2+ vouches to move from Tier 3 to Tier 2
- Maximum 5 certifications count toward score
- Cap: 100 pts from certifications
- Duplicate cert sources don't stack (can't add 3 HubSpot certs)

**Certification Verification:**
```typescript
interface CertificationProof {
  cert_name: string;
  issuer: string;
  cert_url: string;              // Credly badge URL, HubSpot cert page, etc.
  cert_id: string | null;        // Certificate ID if available
  issued_date: string | null;
  verification_status: 'auto_verified' | 'vouch_verified' | 'pending';
}

const RECOGNIZED_CERT_DOMAINS: Record<string, { issuer: string; tier: number; points: number }> = {
  'credly.com': { issuer: 'credly', tier: 1, points: 40 },       // OpenAI certs use Credly
  'credentials.openai.com': { issuer: 'openai', tier: 1, points: 40 },
  'clay.com': { issuer: 'clay', tier: 1, points: 30 },
  'academy.hubspot.com': { issuer: 'hubspot', tier: 2, points: 20 },
  'app.hubspot.com/academy': { issuer: 'hubspot', tier: 2, points: 20 },
  'gtmaiacademy.com': { issuer: 'gtm_ai_academy', tier: 2, points: 20 },
  'productmarketingalliance.com': { issuer: 'pma', tier: 2, points: 15 },
};

function verifyCertification(url: string): CertVerification {
  const hostname = new URL(url).hostname.replace('www.', '');
  const pathMatch = Object.entries(RECOGNIZED_CERT_DOMAINS).find(([domain]) => 
    hostname.includes(domain) || url.includes(domain)
  );
  
  if (pathMatch) {
    return {
      verification_status: 'auto_verified',
      issuer: pathMatch[1].issuer,
      tier: pathMatch[1].tier,
      points: pathMatch[1].points,
    };
  }
  
  return {
    verification_status: 'pending',
    issuer: 'unknown',
    tier: 3,
    points: 10,
  };
}
```

---

### Category 5: Uploaded Artifacts (Skill Files, Agent Configs)

For people who build Claude Code skills, Cursor configs, MCP servers, or prompt libraries locally and never push to GitHub.

| Proof Type | How User Adds It | Verification Method | Tier | Points |
|---|---|---|---|---|
| CLAUDE.md / Agent Config | File upload | Structural parsing + hash uniqueness | Tier 3 → Tier 2 with vouches | 15-25 each |
| .cursorrules | File upload | Structural parsing + hash uniqueness | Tier 3 → Tier 2 with vouches | 10-15 each |
| MCP Server Config | File upload | Structural parsing + hash uniqueness | Tier 3 → Tier 2 with vouches | 15-25 each |
| Prompt Library | File upload | Line count + structural parsing | Tier 3 → Tier 2 with vouches | 10-20 each |
| Workflow Template (YAML/JSON) | File upload | Schema validation | Tier 3 → Tier 2 with vouches | 10-20 each |

Rules already defined in SCORING.md and ANTI-GAMING.md. See those files for parsing logic, hash uniqueness, and vouch requirements.

---

### Category 6: API Usage Verification (v2 — Requires Partnerships)

Direct verification of tool usage via API integrations. These are the highest-confidence proofs because they're impossible to fake — the data comes directly from the tool provider.

| Platform | What We'd Verify | API Status | Tier | Points |
|---|---|---|---|---|
| Clay | Workspace exists, table count, row count, workflow run count | No public API yet — would need partnership | Tier 1 | Up to 100 |
| Vercel | Deployment count, project list, deploy frequency, framework | Public API available (with user OAuth) | Tier 1 | Up to 80 |
| Replit | Repl count, run count, language breakdown, fork count | Public API limited, profile page scrapable | Tier 1 | Up to 60 |
| Anthropic (Claude API) | API call volume, model usage, spend (anonymized tier) | No user-facing API for usage stats | Tier 1 | Up to 80 |
| OpenAI | API call volume, model usage | No user-facing API for usage stats | Tier 1 | Up to 60 |
| Make.com / Zapier | Automation count, run count, app connections | Public API available (with user OAuth) | Tier 1 | Up to 60 |
| Figma | File count, edit activity, component usage | REST API available (with user OAuth) | Tier 1 | Up to 40 |
| Notion | Page count, database count, integration usage | Public API available (with user OAuth) | Tier 2 | Up to 30 |

**API Verification Architecture (v2):**

```typescript
// lib/proofs/api-verification.ts

interface APIVerificationResult {
  platform: string;
  connected: boolean;
  usage_summary: Record<string, any>;
  verification_score: number;
  last_synced: Date;
}

// Each platform gets its own OAuth flow and data extractor
// User goes through: GTM Commit → Platform OAuth → Grant permissions → We pull usage data

// === VERCEL (Available Now) ===
interface VercelUsageData {
  project_count: number;
  total_deployments: number;
  deployment_frequency: 'daily' | 'weekly' | 'monthly' | 'sporadic';
  frameworks_used: string[];                // ['nextjs', 'remix', 'vite']
  last_deployment_at: string;
  team_or_personal: 'team' | 'personal';
}

async function verifyVercelAccount(accessToken: string): Promise<VercelUsageData> {
  // Vercel REST API: https://vercel.com/docs/rest-api
  
  // 1. List all projects
  const projects = await fetch('https://api.vercel.com/v9/projects', {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(r => r.json());
  
  // 2. For each project, get deployment count
  let totalDeployments = 0;
  const frameworks = new Set<string>();
  let lastDeployAt: string | null = null;
  
  for (const project of projects.projects) {
    const deployments = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${project.id}&limit=100`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    ).then(r => r.json());
    
    totalDeployments += deployments.deployments.length;
    if (project.framework) frameworks.add(project.framework);
    
    if (deployments.deployments[0]?.created) {
      const deployDate = deployments.deployments[0].created;
      if (!lastDeployAt || deployDate > lastDeployAt) lastDeployAt = deployDate;
    }
  }
  
  return {
    project_count: projects.projects.length,
    total_deployments: totalDeployments,
    deployment_frequency: calculateFrequency(totalDeployments, projects.projects),
    frameworks_used: Array.from(frameworks),
    last_deployment_at: lastDeployAt || '',
    team_or_personal: projects.projects[0]?.accountId ? 'team' : 'personal',
  };
}

// Scoring for Vercel API verification
function scoreVercelUsage(data: VercelUsageData): number {
  let score = 0;
  
  // Project count (up to 30)
  score += Math.min(30, data.project_count * 10);
  
  // Deployment volume (up to 30)
  score += Math.min(30, Math.round(10 * Math.log2(data.total_deployments + 1)));
  
  // Recency bonus (up to 20)
  const daysSinceLastDeploy = daysBetween(new Date(data.last_deployment_at), new Date());
  if (daysSinceLastDeploy < 7) score += 20;
  else if (daysSinceLastDeploy < 30) score += 10;
  else if (daysSinceLastDeploy < 90) score += 5;
  
  return Math.min(80, score);  // Cap at 80 per platform
}

// === CLAY (Future — Requires Partnership) ===
interface ClayUsageData {
  workspace_name: string;
  table_count: number;
  total_rows_enriched: number;
  workflow_count: number;
  workflow_runs_total: number;
  integrations_connected: string[];         // ['openai', 'apollo', 'clearbit']
  last_active_at: string;
}

// Clay doesn't have a public API yet. When they do:
async function verifyClayAccount(accessToken: string): Promise<ClayUsageData> {
  // Hypothetical endpoint
  const workspace = await fetch('https://api.clay.com/v1/workspace', {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(r => r.json());
  
  return {
    workspace_name: workspace.name,
    table_count: workspace.tables.length,
    total_rows_enriched: workspace.total_rows,
    workflow_count: workspace.workflows.length,
    workflow_runs_total: workspace.workflows.reduce((sum: number, w: any) => sum + w.run_count, 0),
    integrations_connected: workspace.integrations.map((i: any) => i.name),
    last_active_at: workspace.last_active,
  };
}

function scoreClayUsage(data: ClayUsageData): number {
  let score = 0;
  
  // Table count (up to 20)
  score += Math.min(20, data.table_count * 5);
  
  // Workflow runs (up to 40) — logarithmic
  score += Math.min(40, Math.round(15 * Math.log2(data.workflow_runs_total + 1)));
  
  // Integration diversity (up to 20)
  score += Math.min(20, data.integrations_connected.length * 5);
  
  // Recency (up to 20)
  const daysSince = daysBetween(new Date(data.last_active_at), new Date());
  if (daysSince < 7) score += 20;
  else if (daysSince < 30) score += 10;
  
  return Math.min(100, score);  // Clay cap at 100 (it's the GTM tool)
}

// === MAKE.COM / ZAPIER (Available Now) ===
interface AutomationUsageData {
  platform: 'make' | 'zapier';
  automation_count: number;                 // Scenarios (Make) or Zaps (Zapier)
  total_runs: number;
  apps_connected: string[];                 // ['slack', 'hubspot', 'openai', 'gmail']
  last_run_at: string;
}

async function verifyMakeAccount(accessToken: string): Promise<AutomationUsageData> {
  // Make.com API: https://www.make.com/en/api-documentation
  const scenarios = await fetch('https://us1.make.com/api/v2/scenarios', {
    headers: { Authorization: `Token ${accessToken}` },
  }).then(r => r.json());
  
  const apps = new Set<string>();
  let totalRuns = 0;
  
  for (const scenario of scenarios.scenarios) {
    totalRuns += scenario.executions || 0;
    // Extract connected apps from scenario modules
    scenario.modules?.forEach((m: any) => apps.add(m.app));
  }
  
  return {
    platform: 'make',
    automation_count: scenarios.scenarios.length,
    total_runs: totalRuns,
    apps_connected: Array.from(apps),
    last_run_at: scenarios.scenarios[0]?.last_execution || '',
  };
}

function scoreAutomationUsage(data: AutomationUsageData): number {
  let score = 0;
  
  // Automation count (up to 20)
  score += Math.min(20, data.automation_count * 5);
  
  // Total runs (up to 25) — logarithmic
  score += Math.min(25, Math.round(10 * Math.log2(data.total_runs + 1)));
  
  // App diversity (up to 15)
  score += Math.min(15, data.apps_connected.length * 3);
  
  return Math.min(60, score);
}
```

**API OAuth Flow (v2 implementation):**

```
1. User clicks "Connect [Platform]" on their dashboard
2. Redirect to platform's OAuth consent screen
3. User grants read-only access
4. Callback stores refresh token (encrypted) in platform_connections table
5. System pulls usage data immediately + weekly cron refresh
6. Usage data stored in platform_usage table
7. Score recalculated with new API data
```

---

### Category 7: Client/Employer Endorsements (v2)

Different from peer vouches — these come from people in a position of authority (hiring managers, clients, founders) who can attest that the person built real things.

| Endorsement Type | How It Works | Verification | Tier | Points |
|---|---|---|---|---|
| Client Endorsement | User requests endorsement, client receives email with one-click verify | Email verification + no GTM Commit account needed | Tier 2 | 30 each |
| Employer Endorsement | Same flow but marked as employer | Email verification + company domain match | Tier 2 | 35 each |
| Advisor/Mentor Endorsement | Same flow | Email verification | Tier 2 | 20 each |

**Rules:**
- Client/employer does NOT need a GTM Commit account (unlike peer vouches)
- Verification via email: system sends a unique link, endorser clicks to confirm
- Endorser email domain cross-referenced with company claimed (prevents self-endorsement with personal email)
- Maximum 5 client/employer endorsements count toward score
- Cap: 150 pts from endorsements

**Schema:**
```typescript
interface Endorsement {
  id: string;
  profile_id: string;
  endorser_name: string;
  endorser_email: string;          // Used for verification, never displayed
  endorser_title: string;          // "VP Marketing at Acme"
  endorser_company: string;
  endorsement_type: 'client' | 'employer' | 'advisor';
  relationship: string;            // "Hired them to build our outbound system"
  message: string;                 // "Built our entire Clay pipeline, saved 20hrs/week"
  verification_token: string;      // Unique token sent via email
  verified: boolean;
  verified_at: Date | null;
}
```

---

## Updated Scoring Summary (All Proof Types)

### Tier 1 — Auto-Verified (up to 600 pts)

| Source | Max Points |
|---|---|
| GitHub AI commits | 200 |
| Platform deployments (Vercel, Lovable, Replit, Bolt, v0, Railway, Netlify) | 150 |
| GitHub agent repos (CLAUDE.md, MCP, skills) | 120 |
| API-verified usage — v2 (Clay, Vercel OAuth, Make/Zapier) | 100 |
| Recognized certifications (OpenAI, Clay) | 80 |
| Tool diversity bonus | 80 |
| Consistency bonus | 50 |

**Tier 1 cap: 600 pts**

### Tier 2 — Community/Third-Party Verified (up to 250 pts)

| Source | Max Points |
|---|---|
| Vouched portfolio items (2+ vouches) | 120 |
| Client/employer endorsements — v2 (email-verified) | 100 |
| Vouched workflow documentation | 70 |
| Vouched uploaded artifacts (CLAUDE.md, .cursorrules, MCP) | 60 |
| Vouched video proof (Loom/YouTube walkthroughs) | 60 |
| Endorsed impact metrics | 60 |
| Vouched published content (blogs, threads) | 50 |
| Lower-tier certifications with vouches (HubSpot, PMA, GTM AI Academy) | 40 |

**Tier 2 cap: 250 pts**

### Tier 3 — Self-Reported (up to 150 pts)

| Source | Max Points |
|---|---|
| Unvouched portfolio items | 50 |
| Unvouched workflow documentation | 50 |
| Unvouched uploaded artifacts | 45 |
| Unvouched video proof | 30 |
| Tool declarations | 30 |
| Unvouched published content | 25 |
| Unrecognized certifications | 20 |
| Profile completeness | 20 |

**Tier 3 cap: 150 pts**

---

## Database Additions

```sql
-- ============================================================
-- VIDEO PROOFS
-- ============================================================

CREATE TABLE video_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  url TEXT NOT NULL,
  platform TEXT NOT NULL,                  -- 'loom' | 'youtube' | 'vimeo'
  title TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  
  -- Content categorization
  category TEXT,                           -- 'workflow_walkthrough' | 'tool_demo' | 'build_session'
  tools_mentioned TEXT[] DEFAULT '{}',     -- Auto-extracted from title/description
  description TEXT,                        -- User-provided context
  
  -- Verification
  url_verified BOOLEAN DEFAULT false,      -- URL resolves and is public
  vouch_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(profile_id, url)
);

CREATE INDEX idx_video_proofs_profile ON video_proofs(profile_id);

-- ============================================================
-- CONTENT PROOFS (blogs, threads, newsletters)
-- ============================================================

CREATE TABLE content_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  url TEXT NOT NULL,
  platform TEXT NOT NULL,                  -- 'blog' | 'twitter' | 'linkedin' | 'substack' | 'beehiiv' | 'medium' | 'github' | 'other'
  title TEXT,
  published_at TIMESTAMPTZ,
  
  -- Content analysis
  estimated_word_count INTEGER,
  tools_mentioned TEXT[] DEFAULT '{}',
  description TEXT,                        -- User-provided summary
  
  -- Verification
  url_verified BOOLEAN DEFAULT false,
  vouch_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(profile_id, url)
);

CREATE INDEX idx_content_proofs_profile ON content_proofs(profile_id);

-- ============================================================
-- CERTIFICATIONS
-- ============================================================

CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  cert_name TEXT NOT NULL,
  issuer TEXT NOT NULL,                    -- 'openai' | 'clay' | 'hubspot' | 'gtm_ai_academy' | 'pma' | 'other'
  cert_url TEXT NOT NULL,                  -- Credly badge URL, cert page, etc.
  cert_id TEXT,                            -- Certificate ID if available
  issued_at TIMESTAMPTZ,
  
  -- Verification
  verification_status TEXT DEFAULT 'pending',  -- 'auto_verified' | 'vouch_verified' | 'pending'
  verification_method TEXT,                -- 'domain_match' | 'credly_api' | 'vouch' | null
  verified_at TIMESTAMPTZ,
  
  vouch_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(profile_id, cert_url)
);

CREATE INDEX idx_certs_profile ON certifications(profile_id);
CREATE INDEX idx_certs_issuer ON certifications(issuer);

-- ============================================================
-- PLATFORM CONNECTIONS (v2 — OAuth-connected tools)
-- ============================================================

CREATE TABLE platform_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  platform TEXT NOT NULL,                  -- 'vercel' | 'clay' | 'make' | 'zapier' | 'replit' | 'figma' | 'notion'
  
  -- OAuth tokens (encrypted at rest)
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  scopes TEXT[] DEFAULT '{}',
  
  -- Connection status
  status TEXT DEFAULT 'active',            -- 'active' | 'expired' | 'revoked' | 'error'
  last_synced_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  sync_error TEXT,
  
  connected_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(profile_id, platform)
);

CREATE INDEX idx_connections_profile ON platform_connections(profile_id);

-- ============================================================
-- PLATFORM USAGE DATA (v2 — synced from connected platforms)
-- ============================================================

CREATE TABLE platform_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES platform_connections(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  platform TEXT NOT NULL,
  
  -- Usage summary (flexible JSON — varies by platform)
  usage_data JSONB NOT NULL DEFAULT '{}',
  -- vercel: { project_count, total_deployments, frameworks_used, last_deployment_at }
  -- clay: { table_count, total_rows_enriched, workflow_count, workflow_runs, integrations }
  -- make: { automation_count, total_runs, apps_connected, last_run_at }
  -- zapier: { zap_count, total_runs, apps_connected, last_run_at }
  
  -- Scoring
  usage_score INTEGER DEFAULT 0,           -- Calculated based on platform-specific scoring function
  
  synced_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_usage_profile ON platform_usage(profile_id);
CREATE INDEX idx_usage_connection ON platform_usage(connection_id);

-- ============================================================
-- CLIENT/EMPLOYER ENDORSEMENTS (v2)
-- ============================================================

CREATE TABLE endorsements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Endorser info (does NOT need GTM Commit account)
  endorser_name TEXT NOT NULL,
  endorser_email TEXT NOT NULL,            -- For verification, never publicly displayed
  endorser_title TEXT,                     -- "VP Marketing"
  endorser_company TEXT,                   -- "Acme Corp"
  endorsement_type TEXT NOT NULL,          -- 'client' | 'employer' | 'advisor'
  
  -- Endorsement content
  relationship TEXT,                       -- "Hired them to rebuild our outbound system"
  message TEXT NOT NULL,                   -- "Built our Clay pipeline, 3x'd our pipeline in 60 days"
  
  -- Verification
  verification_token TEXT UNIQUE NOT NULL, -- Sent via email to endorser
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  
  -- Display
  display_public BOOLEAN DEFAULT true,     -- Endorser can choose to keep it private
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_endorsements_profile ON endorsements(profile_id);
CREATE INDEX idx_endorsements_token ON endorsements(verification_token) WHERE verified = false;

-- ============================================================
-- RLS FOR NEW TABLES
-- ============================================================

ALTER TABLE video_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE endorsements ENABLE ROW LEVEL SECURITY;

-- Public read for display tables
CREATE POLICY "Video proofs viewable by everyone" ON video_proofs FOR SELECT USING (true);
CREATE POLICY "Users manage own video proofs" ON video_proofs FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Content proofs viewable by everyone" ON content_proofs FOR SELECT USING (true);
CREATE POLICY "Users manage own content proofs" ON content_proofs FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Certifications viewable by everyone" ON certifications FOR SELECT USING (true);
CREATE POLICY "Users manage own certifications" ON certifications FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Endorsements viewable by everyone" ON endorsements FOR SELECT USING (verified = true AND display_public = true);
CREATE POLICY "Users manage own endorsements" ON endorsements FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Private: connection tokens and usage data
CREATE POLICY "Users view own connections" ON platform_connections FOR SELECT USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users manage own connections" ON platform_connections FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users view own usage" ON platform_usage FOR SELECT USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
-- Note: Public profile pages show aggregate usage stats via server-side queries, not direct RLS access
```

---

## Implementation Priority

### V1 (Launch Sprint)
1. GitHub commits + AI detection (already in CLAUDE.md)
2. Platform URL verification (Vercel, Lovable, Replit, Bolt, v0)
3. Portfolio items with vouches
4. Uploaded artifacts (CLAUDE.md, .cursorrules)
5. Tool declarations
6. Profile completeness

### V1.5 (Week 2-3)
7. Video proof (Loom/YouTube URL validation + display)
8. Published content proof (URL validation)
9. Certifications (domain-based auto-verification)

### V2 (Month 2+)
10. Vercel OAuth integration (deployment history pull)
11. Make.com / Zapier OAuth integration
12. Client/employer endorsement system (email verification flow)
13. Clay OAuth integration (when API available)
14. Anthropic/OpenAI usage verification (when APIs available)
