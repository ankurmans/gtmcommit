# SCORING.md — GTM Commit Score Algorithm (Revised)

## Scoring Philosophy

The GTM Commit Score (0–1000) answers one question: **how confident are we that this person actually does AI-native GTM work?**

It is NOT a skill rating. It is NOT a reputation score. It is a verification confidence score. Someone scoring 800 isn't "better" than someone scoring 400 — we just have more evidence that they ship.

---

## Three-Tier Verification Hierarchy

### Tier 1 — Auto-Verified (up to 600 pts)
Machine-confirmed evidence. Cannot be faked without triggering anti-gaming rules.

| Source | How It's Verified | Max Pts |
|---|---|---|
| GitHub AI commits | Commit trailer/author detection: `Co-Authored-By: Claude`, Copilot, Aider, Cursor | 200 |
| Platform deployments | HTTP verification of Vercel, Lovable, Replit, Bolt, v0, Railway, Netlify URLs | 150 |
| GitHub agent repos | CLAUDE.md, MCP configs, .cursorrules, skills detected in repos | 120 |
| API-verified usage (v2) | OAuth-connected: Clay, Vercel, Make, Zapier usage data pulled directly | 100 |
| Recognized certifications | URL pattern match against known cert domains (Credly/OpenAI, Clay, etc.) | 80 |
| Tool diversity bonus | Using 3+ distinct AI tools across all proof types | 80 |
| Consistency bonus | Activity across 3+ months (not a one-day burst) | 50 |

**Tier 1 hard cap: 600 points**

### Tier 2 — Community/Third-Party Verified (up to 250 pts)
Requires human validation — peer vouches, client endorsements, or email verification.

| Source | How It's Verified | Max Pts |
|---|---|---|
| Vouched portfolio items | 2+ peers vouch for a portfolio item | 120 |
| Client/employer endorsements (v2) | Email-verified, endorser doesn't need GTM Commit account | 100 |
| Vouched workflow documentation | 2+ vouches on workflow uploads | 70 |
| Vouched uploaded artifacts | 2+ vouches on CLAUDE.md, .cursorrules, MCP files | 60 |
| Vouched video proof | 2+ vouches on Loom/YouTube walkthroughs | 60 |
| Endorsed impact metrics | Revenue, pipeline, or efficiency metrics with vouches | 60 |
| Vouched published content | 2+ vouches on blog posts, threads, guides | 50 |
| Lower-tier certs with vouches | HubSpot, PMA, GTM AI Academy + 2 vouches | 40 |

**Tier 2 hard cap: 250 points**

### Tier 3 — Self-Reported (up to 150 pts)
Honor system. Lowest weight. Exists so new users aren't stuck at zero.

| Source | How It's Verified | Max Pts |
|---|---|---|
| Unvouched portfolio items | URL exists, honor system | 50 |
| Unvouched workflow documentation | Text exists, honor system | 50 |
| Unvouched uploaded artifacts | File parses, hash unique | 45 |
| Unvouched video proof | URL resolves, ≥30 seconds | 30 |
| Tool declarations | Self-reported tool list | 30 |
| Unvouched published content | URL resolves | 25 |
| Unrecognized certifications | URL resolves, pending review | 20 |
| Profile completeness | Bio, headline, avatar, links | 20 |

**Tier 3 hard cap: 150 points**

---

## Detailed Scoring Functions

### GitHub AI Commits (up to 200 pts)

```typescript
function scoreGitHubCommits(commits: AICommit[]): number {
  const uniqueRepos = new Set(commits.map(c => c.repo_id)).size;
  const totalCommits = commits.length;
  const tools = new Set(commits.map(c => c.ai_tool));
  
  // Volume: logarithmic (diminishing returns past ~100 commits)
  const volumeScore = Math.min(80, Math.round(25 * Math.log2(totalCommits + 1)));
  
  // Repo diversity: more repos = more genuine usage
  const diversityScore = Math.min(50, uniqueRepos * 10);
  
  // Tool diversity: using multiple AI tools
  const toolScore = Math.min(40, (tools.size - 1) * 20);
  
  // Recency: commits in last 30 days get bonus
  const recentCommits = commits.filter(c => 
    Date.now() - new Date(c.committed_at).getTime() < 30 * 86400 * 1000
  ).length;
  const recencyScore = Math.min(30, recentCommits * 3);
  
  return Math.min(200, volumeScore + diversityScore + toolScore + recencyScore);
}
```

### Platform Deployments (up to 150 pts)

```typescript
function scorePlatformDeployments(deployments: ExternalProof[]): number {
  const verified = deployments.filter(d => d.verification_status === 'verified');
  const platforms = new Set(verified.map(d => d.platform));
  
  // Per deployment: 30 pts each
  const deployScore = Math.min(120, verified.length * 30);
  
  // Platform diversity bonus: using 3+ platforms
  const diversityBonus = platforms.size >= 3 ? 30 : platforms.size >= 2 ? 15 : 0;
  
  return Math.min(150, deployScore + diversityBonus);
}
```

### GitHub Agent Repos (up to 120 pts)

```typescript
function scoreAgentRepos(repos: AgentRepo[]): number {
  // Must have 3+ files to count (anti-gaming: empty repos filtered)
  const validRepos = repos.filter(r => r.file_count >= 3);
  
  let score = 0;
  for (const repo of validRepos) {
    let repoScore = 0;
    
    if (repo.has_claude_md) repoScore += 15;
    if (repo.has_mcp_config) repoScore += 15;
    if (repo.has_cursorrules) repoScore += 10;
    if (repo.has_skills_dir) repoScore += 10;
    
    // README quality bonus
    if (repo.readme_length > 500) repoScore += 5;
    
    score += Math.min(40, repoScore);  // Cap per repo: 40
  }
  
  return Math.min(120, score);
}
```

### API-Verified Usage — v2 (up to 100 pts)

```typescript
function scoreAPIUsage(usageRecords: PlatformUsage[]): number {
  let totalScore = 0;
  
  for (const usage of usageRecords) {
    switch (usage.platform) {
      case 'vercel':
        totalScore += scoreVercelUsage(usage.usage_data);  // Max 80
        break;
      case 'clay':
        totalScore += scoreClayUsage(usage.usage_data);    // Max 100
        break;
      case 'make':
      case 'zapier':
        totalScore += scoreAutomationUsage(usage.usage_data); // Max 60
        break;
    }
  }
  
  return Math.min(100, totalScore);  // Combined cap
}
```

### Certifications (up to 80 pts Tier 1 / 40 pts Tier 2)

```typescript
function scoreCertifications(certs: Certification[]): { tier1: number; tier2: number } {
  let tier1 = 0;
  let tier2 = 0;
  
  // Deduplicate by issuer (only best cert per issuer counts)
  const byIssuer = groupBy(certs, 'issuer');
  
  for (const [issuer, issuerCerts] of Object.entries(byIssuer)) {
    const best = issuerCerts.sort((a, b) => certPoints(b) - certPoints(a))[0];
    
    if (best.verification_status === 'auto_verified') {
      tier1 += certPoints(best);
    } else if (best.verification_status === 'vouch_verified' && best.vouch_count >= 2) {
      tier2 += certPoints(best);
    }
  }
  
  return { 
    tier1: Math.min(80, tier1), 
    tier2: Math.min(40, tier2) 
  };
}

function certPoints(cert: Certification): number {
  const CERT_POINTS: Record<string, number> = {
    'openai': 40,
    'credly': 40,
    'clay': 30,
    'hubspot': 20,
    'gtm_ai_academy': 20,
    'pavilion': 20,
    'pma': 15,
    'other': 10,
  };
  return CERT_POINTS[cert.issuer] || 10;
}
```

### Video Proof (up to 60 pts Tier 2 / 30 pts Tier 3)

```typescript
function scoreVideoProof(videos: VideoProof[]): { tier2: number; tier3: number } {
  const sorted = videos
    .filter(v => v.url_verified && v.duration_seconds >= 30)
    .sort((a, b) => videoQuality(b) - videoQuality(a))
    .slice(0, 5);  // Max 5 videos count
  
  let tier2 = 0;
  let tier3 = 0;
  
  for (const video of sorted) {
    const pts = videoPoints(video);
    
    if (video.vouch_count >= 2) {
      tier2 += pts.vouched;
    } else {
      tier3 += pts.unvouched;
    }
  }
  
  return { 
    tier2: Math.min(60, tier2), 
    tier3: Math.min(30, tier3) 
  };
}

function videoPoints(video: VideoProof): { vouched: number; unvouched: number } {
  const CATEGORY_POINTS = {
    'build_session': { vouched: 40, unvouched: 15 },
    'workflow_walkthrough': { vouched: 35, unvouched: 12 },
    'tool_demo': { vouched: 25, unvouched: 8 },
  };
  
  const base = CATEGORY_POINTS[video.category || 'tool_demo'] || CATEGORY_POINTS.tool_demo;
  
  // Duration bonus: longer = more credible
  const durationMultiplier = video.duration_seconds > 300 ? 1.2 :
                             video.duration_seconds > 120 ? 1.1 : 1.0;
  
  return {
    vouched: Math.round(base.vouched * durationMultiplier),
    unvouched: Math.round(base.unvouched * durationMultiplier),
  };
}
```

### Published Content (up to 50 pts Tier 2 / 25 pts Tier 3)

```typescript
function scoreContent(content: ContentProof[]): { tier2: number; tier3: number } {
  const verified = content
    .filter(c => c.url_verified)
    .sort((a, b) => contentQuality(b) - contentQuality(a))
    .slice(0, 8);  // Max 8 pieces count
  
  let tier2 = 0;
  let tier3 = 0;
  
  for (const piece of verified) {
    const pts = contentPoints(piece);
    
    if (piece.vouch_count >= 2) {
      tier2 += pts.vouched;
    } else {
      tier3 += pts.unvouched;
    }
  }
  
  return { 
    tier2: Math.min(50, tier2), 
    tier3: Math.min(25, tier3) 
  };
}

function contentPoints(piece: ContentProof): { vouched: number; unvouched: number } {
  const PLATFORM_POINTS: Record<string, { vouched: number; unvouched: number }> = {
    'blog': { vouched: 30, unvouched: 15 },
    'substack': { vouched: 25, unvouched: 12 },
    'beehiiv': { vouched: 25, unvouched: 12 },
    'medium': { vouched: 20, unvouched: 10 },
    'github': { vouched: 25, unvouched: 12 },
    'twitter': { vouched: 20, unvouched: 8 },
    'linkedin': { vouched: 20, unvouched: 8 },
    'other': { vouched: 15, unvouched: 6 },
  };
  
  return PLATFORM_POINTS[piece.platform] || PLATFORM_POINTS.other;
}
```

### Client/Employer Endorsements — v2 (up to 100 pts)

```typescript
function scoreEndorsements(endorsements: Endorsement[]): number {
  const verified = endorsements.filter(e => e.verified);
  
  let score = 0;
  for (const endorsement of verified.slice(0, 5)) {  // Max 5
    switch (endorsement.endorsement_type) {
      case 'employer': score += 35; break;
      case 'client': score += 30; break;
      case 'advisor': score += 20; break;
    }
  }
  
  return Math.min(100, score);
}
```

### Tool Diversity Bonus (up to 80 pts)

```typescript
function scoreToolDiversity(profile: FullProfile): number {
  const tools = new Set<string>();
  
  // From GitHub commits
  profile.ai_commits.forEach(c => tools.add(c.ai_tool));
  
  // From platform deployments
  profile.external_proofs.forEach(p => tools.add(p.platform));
  
  // From video proofs
  profile.video_proofs.forEach(v => v.tools_mentioned.forEach(t => tools.add(t)));
  
  // From API connections
  profile.platform_connections.forEach(c => tools.add(c.platform));
  
  // From uploaded artifacts
  if (profile.uploaded_files.some(f => f.file_type === 'claude_md')) tools.add('claude_code');
  if (profile.uploaded_files.some(f => f.file_type === 'cursorrules')) tools.add('cursor');
  if (profile.uploaded_files.some(f => f.file_type === 'mcp_config')) tools.add('mcp');
  
  // From tool declarations
  profile.tool_declarations.forEach(t => tools.add(t));
  
  if (tools.size >= 7) return 80;
  if (tools.size >= 5) return 60;
  if (tools.size >= 3) return 40;
  if (tools.size >= 2) return 20;
  return 0;
}
```

### Consistency Bonus (up to 50 pts)

```typescript
function scoreConsistency(profile: FullProfile): number {
  const activityDates = [
    ...profile.ai_commits.map(c => new Date(c.committed_at)),
    ...profile.external_proofs.map(p => new Date(p.verified_at)),
    ...profile.video_proofs.map(v => new Date(v.created_at)),
    ...profile.content_proofs.map(c => new Date(c.published_at || c.created_at)),
    ...profile.certifications.map(c => new Date(c.issued_at || c.created_at)),
  ];
  
  if (activityDates.length === 0) return 0;
  
  const months = new Set(activityDates.map(d => `${d.getFullYear()}-${d.getMonth()}`));
  
  if (months.size >= 6) return 50;
  if (months.size >= 4) return 35;
  if (months.size >= 3) return 25;
  if (months.size >= 2) return 15;
  return 0;
}
```

---

## Master Score Calculator

```typescript
interface GtmCommitScore {
  total: number;
  tier1: number;
  tier2: number;
  tier3: number;
  rank: 'unranked' | 'shipper' | 'builder' | 'captain' | 'legend';
  breakdown: ScoreBreakdown;
}

function calculateGtmCommitScore(profile: FullProfile): GtmCommitScore {
  // === TIER 1 ===
  const githubCommits = scoreGitHubCommits(profile.ai_commits);
  const platformDeploys = scorePlatformDeployments(profile.external_proofs);
  const agentRepos = scoreAgentRepos(profile.agent_repos);
  const apiUsage = scoreAPIUsage(profile.platform_usage);
  const certs = scoreCertifications(profile.certifications);
  const toolDiversity = scoreToolDiversity(profile);
  const consistency = scoreConsistency(profile);
  
  const tier1 = Math.min(600,
    githubCommits + platformDeploys + agentRepos + apiUsage +
    certs.tier1 + toolDiversity + consistency
  );
  
  // === TIER 2 ===
  const vouchedPortfolio = scoreVouchedPortfolio(profile.portfolio_items);
  const endorsements = scoreEndorsements(profile.endorsements);
  const vouchedWorkflows = scoreVouchedWorkflows(profile.workflows);
  const vouchedUploads = scoreVouchedUploads(profile.uploaded_files);
  const videoProof = scoreVideoProof(profile.video_proofs);
  const contentProof = scoreContent(profile.content_proofs);
  const impactMetrics = scoreImpactMetrics(profile.impact_metrics);
  
  const tier2 = Math.min(250,
    vouchedPortfolio + endorsements + vouchedWorkflows + vouchedUploads +
    videoProof.tier2 + contentProof.tier2 + impactMetrics + certs.tier2
  );
  
  // === TIER 3 ===
  const unvouchedPortfolio = scoreUnvouchedPortfolio(profile.portfolio_items);
  const unvouchedWorkflows = scoreUnvouchedWorkflows(profile.workflows);
  const unvouchedUploads = scoreUnvouchedUploads(profile.uploaded_files);
  const toolDeclarations = scoreToolDeclarations(profile.tool_declarations);
  const profileCompleteness = scoreProfileCompleteness(profile);
  
  const tier3 = Math.min(150,
    unvouchedPortfolio + unvouchedWorkflows + unvouchedUploads +
    videoProof.tier3 + contentProof.tier3 + toolDeclarations + profileCompleteness
  );
  
  const total = tier1 + tier2 + tier3;
  
  return {
    total,
    tier1,
    tier2,
    tier3,
    rank: getRank(total),
    breakdown: {
      githubCommits, platformDeploys, agentRepos, apiUsage,
      certsTier1: certs.tier1, toolDiversity, consistency,
      vouchedPortfolio, endorsements, vouchedWorkflows, vouchedUploads,
      videoTier2: videoProof.tier2, contentTier2: contentProof.tier2,
      impactMetrics, certsTier2: certs.tier2,
      unvouchedPortfolio, unvouchedWorkflows, unvouchedUploads,
      videoTier3: videoProof.tier3, contentTier3: contentProof.tier3,
      toolDeclarations, profileCompleteness,
    },
  };
}

function getRank(score: number): string {
  if (score >= 750) return 'legend';
  if (score >= 500) return 'captain';
  if (score >= 250) return 'builder';
  if (score >= 50) return 'shipper';
  return 'unranked';
}
```

---

## Scenario Checks

### Scenario 1: The API Builder
Uses Clay daily (200+ workflow runs), ships scripts via Claude Code, 80 AI commits across 5 repos, 2 Vercel deployments. 3 blog posts about Clay workflows. Clay certification.

| Source | Pts |
|---|---|
| GitHub AI commits (80, 5 repos, 1 tool) | ~130 |
| Platform deployments (2 Vercel) | 60 |
| Clay API usage (v2, 200+ runs) | 80 |
| Clay certification (auto-verified) | 30 |
| Tool diversity (Claude Code + Clay + Vercel = 3) | 40 |
| Consistency (6 months) | 50 |
| Content proof — 3 blogs with vouches | 45 |
| Profile completeness | 15 |
| **Total** | **~450 (Builder)** |

### Scenario 2: The Vibe Shipper
6 Lovable, 2 Bolt, 1 v0 deployment. Zero GitHub. 4 Loom walkthroughs. 2 client endorsements. HubSpot AI cert.

| Source | Pts |
|---|---|
| Platform deployments (9 total, capped) | 150 |
| Tool diversity (Lovable + Bolt + v0 = 3) | 40 |
| Consistency (4 months) | 35 |
| Client endorsements (2 × 30) | 60 |
| Vouched video proof (2 of 4 have vouches) | 55 |
| HubSpot cert with vouches | 20 |
| Profile completeness | 20 |
| **Total** | **~380 (Builder)** |

### Scenario 3: The Agent Builder
12 Claude Code agent repos. 150 AI commits. 3 uploaded CLAUDE.md files. 2 Twitter threads. OpenAI cert. 1 employer endorsement.

| Source | Pts |
|---|---|
| GitHub AI commits (150, 12 repos, 1 tool) | ~155 |
| Agent repos (12, capped) | 120 |
| OpenAI cert (auto-verified) | 40 |
| Tool diversity (Claude Code + uploaded .cursorrules = 2) | 20 |
| Consistency (5 months) | 35 |
| Employer endorsement (1 × 35) | 35 |
| Vouched uploaded artifacts (3 CLAUDE.md) | 45 |
| Content — 2 threads unvouched | 16 |
| Profile completeness | 20 |
| **Total** | **~486 (Builder, near Captain)** |

### Scenario 4: The Full Stack GTM Operator (Legend target)
200+ AI commits (Claude Code + Copilot), 15 repos. 5 Vercel + 3 Lovable deployments. 8 agent repos. Clay + Vercel OAuth. 500 Clay runs. OpenAI + Clay certs. 5 Looms. 4 blogs. 3 client + 1 employer endorsement.

| Source | Pts |
|---|---|
| GitHub AI commits | 200 |
| Platform deployments | 150 |
| Agent repos | 120 |
| API usage (Clay + Vercel, capped) | 100 |
| Certs Tier 1 (OpenAI + Clay) | 70 |
| Tool diversity (7+) | 80 |
| Consistency (6+ months) | 50 |
| **Tier 1** | **600 (capped)** |
| Vouched portfolio | 80 |
| Endorsements (4 total, capped) | 100 |
| Vouched videos | 55 |
| Vouched content | 45 |
| Impact metrics | 40 |
| **Tier 2** | **250 (capped)** |
| Profile + unvouched extras | 50 |
| **Tier 3** | **50** |
| **Grand Total** | **900 (Legend)** |

---

## Anti-Gaming Cross-Reference

All scoring subject to rules in `ANTI-GAMING.md`:

- **GitHub commits:** Burst detection, empty commit filter, fork/clone detection
- **Platform deployments:** 24hr min age, blank template detection, weekly re-verification
- **Video proofs:** 30s minimum, URL must resolve publicly
- **Content proofs:** URL must resolve (HTTP 200), duplicates rejected
- **Certifications:** Domain must match known issuers, deduped by issuer
- **API usage:** Data from platform APIs directly — unfakeable
- **Endorsements:** Email domain cross-ref with company, self-endorsement blocked
- **Vouches:** Mutual penalty (50%), min 50 pts to vouch, max 3 from same company
- **Global:** 200 pts/day velocity limit, community flag system
