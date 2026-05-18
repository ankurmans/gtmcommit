# ANTI-GAMING.md — GTM Commit Integrity Framework

## Overview

The GTM Commit score is only valuable if it's trustworthy. If someone can fake a Legend score, the entire platform is worthless. This document defines every known gaming vector and the countermeasure for each.

**Design principle:** Make gaming harder than actually building. The effort required to fake a 500+ score should exceed the effort of just shipping real work and getting vouches.

---

## GitHub Gaming

### 1. Forked Repo Exploitation

**Attack:** User forks a repo that has 200 Claude Code commits. Their profile shows 200 AI-assisted commits they never wrote.

**Detection:**
```typescript
// lib/github/anti-gaming.ts

function isForkedRepo(repo: GitHubRepo): boolean {
  return repo.fork === true;
}

function getValidCommitsFromFork(commits: Commit[], repo: GitHubRepo, userId: string): Commit[] {
  if (!repo.fork) return commits;
  
  // Only count commits authored by this user AFTER the fork date
  const forkDate = new Date(repo.created_at); // Fork creation = when user forked it
  return commits.filter(c => 
    c.author?.id === userId &&
    new Date(c.commit.author.date) > forkDate
  );
}
```

**Rule:** Forked repos → only count commits authored by the user AFTER fork date. Commits that came with the fork are excluded.

---

### 2. Clone and Re-push

**Attack:** User clones someone else's repo (not via GitHub fork), pushes it as their own. No `fork: true` flag.

**Detection:**
```typescript
function validateCommitAuthorship(commits: Commit[], userEmails: string[]): Commit[] {
  // Only count commits where the author email matches the user's GitHub account
  return commits.filter(c => {
    const authorEmail = c.commit.author?.email;
    return userEmails.includes(authorEmail);
  });
}

function detectSuspiciousHistory(commits: Commit[], repoCreatedAt: Date): boolean {
  // Flag if >80% of commits predate the repo's push date
  const prePushCommits = commits.filter(c => 
    new Date(c.commit.author.date) < repoCreatedAt
  );
  return prePushCommits.length / commits.length > 0.8;
}
```

**Rule:** Commit author email must match the authenticated user's GitHub email(s). Flag repos where >80% of commits predate the repo creation.

---

### 3. Commit Message Spoofing

**Attack:** User manually types `Co-Authored-By: Claude <noreply@anthropic.com>` in commit messages without ever using Claude Code.

**Detection:**
```typescript
function detectCommitSpoofing(commits: Commit[]): SpoofingSignal {
  const aiCommits = commits.filter(c => c.ai_tool_detected);
  
  // Signal 1: All AI commits use identical message patterns
  const messageTemplates = new Set(aiCommits.map(c => 
    c.commit.message.replace(/[a-f0-9]{7,}/g, '[hash]').replace(/\d+/g, '[num]')
  ));
  const lowVariety = messageTemplates.size < aiCommits.length * 0.3;
  
  // Signal 2: Burst pattern — >20 AI commits in a single day
  const commitsByDay = groupByDay(aiCommits);
  const hasBurst = Object.values(commitsByDay).some(dayCommits => dayCommits.length > 20);
  
  // Signal 3: Only one AI tool detected across ALL commits (suspicious if high volume)
  const toolVariety = new Set(aiCommits.map(c => c.ai_tool_detected));
  const singleToolHighVolume = toolVariety.size === 1 && aiCommits.length > 50;
  
  // Signal 4: AI commits but zero non-AI commits in same repo (real usage has both)
  const totalCommits = commits.length;
  const aiRatio = aiCommits.length / totalCommits;
  const unrealisticRatio = aiRatio > 0.95 && aiCommits.length > 20;
  
  return {
    isSuspicious: lowVariety || hasBurst || singleToolHighVolume || unrealisticRatio,
    signals: { lowVariety, hasBurst, singleToolHighVolume, unrealisticRatio },
  };
}
```

**Rule:** Flag profiles where AI commits show low message variety, single-day bursts of >20, unrealistic AI-to-total commit ratios (>95% with 20+ commits), or single-tool-only high volume. Flagged profiles get manually reviewed before score counts.

---

### 4. Empty / Trivial Commits

**Attack:** Push 100 commits that only change whitespace, comments, or trivial formatting to farm the commit count.

**Detection:**
```typescript
function isSubstantiveCommit(commit: Commit): boolean {
  // Minimum diff threshold
  const totalChanges = (commit.stats?.additions || 0) + (commit.stats?.deletions || 0);
  if (totalChanges < 5) return false;
  
  // Ignore commits that only touch non-code files
  const codeFiles = commit.files?.filter(f => 
    !f.filename.match(/\.(md|txt|json|yml|yaml|lock|env|gitignore)$/i)
  );
  if (codeFiles?.length === 0 && totalChanges < 20) return false;
  
  return true;
}
```

**Rule:** Ignore commits with fewer than 5 lines changed. Commits that only modify config/docs files must have 20+ lines changed to count.

---

### 5. Self-star Empty Repos

**Attack:** Create 10 repos, each with just a CLAUDE.md file, to farm the agent/skill score at 40 pts per repo.

**Detection:**
```typescript
function isSubstantiveAgentRepo(repo: GitHubRepo): boolean {
  // Must have more than just CLAUDE.md
  if (repo.size < 10) return false;  // KB — tiny repos filtered
  
  // Must have at least 3 files
  const fileCount = repo.files?.length || 0;
  if (fileCount < 3) return false;
  
  // Must have at least 1 commit beyond the initial commit
  if (repo.commit_count < 2) return false;
  
  // README must exist (bare minimum documentation)
  const hasReadme = repo.files?.some(f => f.name.toLowerCase().startsWith('readme'));
  if (!hasReadme) return false;
  
  return true;
}
```

**Rule:** Agent/skill repos must have 3+ files, 2+ commits, a README, and >10KB total size. Bare CLAUDE.md-only repos don't count.

---

## Platform Deployment Gaming

### 6. Blank Template Deployments

**Attack:** Deploy 5 unmodified Next.js starter templates to Vercel, collect 30 pts each = 150 pts for zero work.

**Detection:**
```typescript
async function verifyDeploymentContent(url: string): Promise<ContentCheck> {
  const response = await fetch(url);
  const html = await response.text();
  
  // Must have >1KB of actual content (not just boilerplate HTML)
  if (html.length < 1024) return { valid: false, reason: 'insufficient_content' };
  
  // Check for common starter template signatures
  const starterSignatures = [
    'Welcome to Next.js',
    'Get started by editing',
    'Create Next App',
    'Powered by Vercel',
    'Welcome to Vite',
    'Hello from Bolt',
  ];
  const isStarter = starterSignatures.some(sig => html.includes(sig));
  if (isStarter) return { valid: false, reason: 'unmodified_template' };
  
  return { valid: true };
}
```

**Rule:** Verified URLs must return >1KB of content and must not contain known starter template signatures. Unmodified templates are rejected.

---

### 7. Recycled URL Submissions

**Attack:** Submit the same project under different URLs (custom domain + vercel.app + www variant) to multiply points.

**Detection:**
```typescript
function deduplicateProofs(proofs: ExternalProof[]): ExternalProof[] {
  // Group by resolved final URL (after redirects)
  const resolvedGroups = new Map<string, ExternalProof[]>();
  
  for (const proof of proofs) {
    // Follow redirects to get canonical URL
    const canonical = proof.resolved_url || proof.project_url;
    const root = new URL(canonical).hostname.replace(/^www\./, '');
    
    if (!resolvedGroups.has(root)) {
      resolvedGroups.set(root, []);
    }
    resolvedGroups.get(root)!.push(proof);
  }
  
  // Keep only one proof per root domain (highest scoring)
  return Array.from(resolvedGroups.values()).map(group => 
    group.sort((a, b) => b.proof_score - a.proof_score)[0]
  );
}
```

**Rule:** Only one proof per root domain. Follow redirects to canonical URL before deduplication. www and non-www treated as same domain.

---

### 8. Deploy-Verify-Delete

**Attack:** Deploy a site, get it verified, immediately delete it. Keep the 30 pts forever.

**Detection:**
```typescript
// Periodic re-verification job (weekly cron)
async function reVerifyProofs(env: Env): Promise<void> {
  const verifiedProofs = await getVerifiedProofs(env);
  
  for (const proof of verifiedProofs) {
    const response = await fetch(proof.project_url, { method: 'HEAD' });
    
    if (!response.ok) {
      // URL is dead — mark as failed, remove points
      await updateProofStatus(env, proof.id, 'failed');
      await recalculateScore(env, proof.profile_id);
    }
  }
}
```

**Rules:**
- Deployment must be >24 hours old before verification counts
- Weekly re-verification cron checks all verified URLs are still live
- Dead URLs get status changed to `failed` and points removed automatically

---

## Vouch Gaming

### 9. Vouch Rings

**Attack:** 5 friends all vouch for each other to inflate everyone's scores.

**Detection:**
```typescript
function detectVouchRing(vouches: Vouch[]): VouchRingResult {
  // Build directed graph of vouches
  const graph = new Map<string, Set<string>>();
  
  for (const vouch of vouches) {
    if (!graph.has(vouch.voucher_id)) graph.set(vouch.voucher_id, new Set());
    graph.get(vouch.voucher_id)!.add(vouch.vouchee_id);
  }
  
  // Detect mutual vouches: A→B and B→A
  const mutualPairs: [string, string][] = [];
  for (const [voucher, vouchees] of graph) {
    for (const vouchee of vouchees) {
      if (graph.get(vouchee)?.has(voucher)) {
        mutualPairs.push([voucher, vouchee]);
      }
    }
  }
  
  return { mutualPairs, hasSuspiciousPattern: mutualPairs.length > 0 };
}
```

**Rule:** Mutual vouches (A↔B) are each worth 50% of normal value. If A vouches B AND B vouches A, each vouch counts as 7.5 pts instead of 15 pts. Triangular rings (A→B→C→A) trigger admin review.

---

### 10. Throwaway Vouch Accounts

**Attack:** Create a GitHub account, sign up for GTM Commit, vouch for a friend, abandon the account.

**Rules:**
- **Minimum score to vouch:** Voucher must have ≥50 GTM Commit pts (Shipper tier) before their vouch counts toward anyone's score
- **Account age minimum:** Account must be >7 days old to vouch
- **Voucher must have at least 1 verified proof source** (GitHub connected OR 1 verified deployment OR 1 parsed upload)

```typescript
function canVouch(voucher: Profile): boolean {
  return (
    voucher.gtmcommit_score >= 50 &&
    daysSinceCreation(voucher.created_at) >= 7 &&
    voucher.has_any_verified_proof
  );
}
```

---

### 11. Team / Company Stacking

**Attack:** Entire team of 8 at a company all vouch for each other, stacking everyone's scores.

**Rule:** Maximum 3 vouches from users at the same company count toward your score. Determined by the `company` field on profiles. If 5 people from "Acme Inc" vouch for you, only the first 3 count.

```typescript
function applyCompanyVouchCap(vouches: Vouch[], voucheeProfile: Profile): Vouch[] {
  const companyCount = new Map<string, number>();
  const MAX_PER_COMPANY = 3;
  
  return vouches.filter(v => {
    const voucherCompany = v.voucher_profile.company?.toLowerCase().trim();
    if (!voucherCompany) return true; // No company = no cap
    
    const current = companyCount.get(voucherCompany) || 0;
    if (current >= MAX_PER_COMPANY) return false;
    
    companyCount.set(voucherCompany, current + 1);
    return true;
  });
}
```

---

## Upload Gaming

### 12. Copied Files

**Attack:** Download someone's public CLAUDE.md from GitHub, upload it as your own.

**Detection:**
```typescript
async function checkFileUniqueness(fileHash: string, profileId: string): Promise<boolean> {
  // SHA-256 hash the uploaded file content
  // Check against all existing uploads across all users
  const existing = await db.query(
    'SELECT id, profile_id FROM uploaded_files WHERE content_hash = ? AND profile_id != ?',
    [fileHash, profileId]
  );
  
  return existing.length === 0; // true = unique
}
```

**Rule:** Exact file hash matches across users are rejected. User sees: "This file has already been uploaded by another member. Please upload your original work."

---

### 13. AI-Generated Fake Skill Files

**Attack:** Ask ChatGPT to generate a convincing CLAUDE.md with fake tool definitions and system prompts.

**Mitigation:**
- Structural parsing catches obviously fake files but can't distinguish AI-generated-for-real-use from AI-generated-to-fake
- **Primary defense: vouch requirement.** Without 2+ vouches, uploaded files stay in Tier 3 (15 pts max per file, 45 pts cap). The low score makes this attack low-reward.
- **Secondary defense: community reporting.** Any member can flag an uploaded file as suspicious. Flagged files get admin review.

**Rule:** Uploaded files without vouches are capped at Tier 3 scoring. The system accepts that Tier 3 might contain some fakes — the low point value makes it not worth gaming.

---

## Global Anti-Gaming Rules

### 14. Score Velocity Limit

**Attack:** Various gaming methods combined to spike a score rapidly.

**Rule:** Maximum score increase of 200 pts in any 24-hour period. If a score recalculation would exceed this, the excess is queued and applied the next day. Legitimate users building their profile won't hit this — it takes days to get vouches and verify deployments.

```typescript
async function applyVelocityLimit(
  profileId: string, 
  newScore: number, 
  previousScore: number
): Promise<number> {
  const MAX_DAILY_GAIN = 200;
  const lastScoreUpdate = await getLastScoreUpdate(profileId);
  
  if (isWithin24Hours(lastScoreUpdate)) {
    const dailyGain = newScore - previousScore;
    if (dailyGain > MAX_DAILY_GAIN) {
      return previousScore + MAX_DAILY_GAIN; // Cap at max daily gain
    }
  }
  
  return newScore;
}
```

---

### 15. New Account Restrictions

**Rules for accounts less than 7 days old:**
- Cannot vouch for other members
- Cannot have vouches count toward Tier 2 (vouches received are stored but don't affect score until account is 7+ days old)
- Score recalculation delayed by 24 hours after initial GitHub sync (prevents rapid gaming assessment)

---

### 16. Community Reporting

**Any authenticated member can flag:**
- A profile as suspicious
- A specific portfolio item as fake
- An uploaded file as copied/generated
- A vouch as illegitimate

**Flag handling:**
- 1 flag: logged, no action
- 3 flags from different users: item hidden pending admin review
- Admin review results: clear (unflag) or remove (item deleted, score recalculated)

```sql
CREATE TABLE flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES profiles(id),
  
  -- What's being flagged
  flag_type TEXT NOT NULL,        -- 'profile' | 'portfolio_item' | 'upload' | 'vouch'
  target_id UUID NOT NULL,       -- ID of the flagged entity
  target_profile_id UUID NOT NULL REFERENCES profiles(id),
  
  reason TEXT NOT NULL,           -- 'fake_commits' | 'copied_file' | 'fake_vouch' | 'spam' | 'other'
  description TEXT,               -- Free text explanation
  
  status TEXT DEFAULT 'pending',  -- 'pending' | 'reviewed_clear' | 'reviewed_removed'
  reviewed_by TEXT,               -- Admin who reviewed
  reviewed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(reporter_id, flag_type, target_id)  -- One flag per reporter per item
);

CREATE INDEX idx_flags_target ON flags(target_profile_id, status);
CREATE INDEX idx_flags_count ON flags(flag_type, target_id, status) WHERE status = 'pending';
```

---

## Summary: Anti-Gaming Ruleset

| # | Vector | Rule | Severity |
|---|---|---|---|
| 1 | Forked repos | Only count user's commits after fork date | Critical |
| 2 | Cloned repos | Commit author email must match GitHub account | Critical |
| 3 | Commit spoofing | Flag low-variety, burst, single-tool, high-ratio patterns | High |
| 4 | Empty commits | Minimum 5 lines changed, 20 for docs-only | Medium |
| 5 | Empty agent repos | Must have 3+ files, 2+ commits, README, >10KB | Medium |
| 6 | Blank deployments | Must have >1KB content, no starter template signatures | High |
| 7 | Recycled URLs | One proof per root domain after redirect resolution | Medium |
| 8 | Deploy-verify-delete | 24hr minimum age, weekly re-verification cron | Medium |
| 9 | Vouch rings | Mutual vouches worth 50%, triangles trigger admin review | High |
| 10 | Throwaway vouch accounts | Must have ≥50 pts, >7 days old, 1+ verified proof to vouch | Critical |
| 11 | Company stacking | Max 3 vouches from same company | Medium |
| 12 | Copied uploads | SHA-256 hash uniqueness check across all users | High |
| 13 | Fake generated files | Tier 3 cap without vouches, community reporting | Low |
| 14 | Score velocity | Max +200 pts per 24 hours | Medium |
| 15 | New account abuse | 7-day restrictions on vouching | Medium |
| 16 | General abuse | Community flag system, 3 flags = hidden pending review | Medium |

---

## Database Additions

Add these tables to the main schema migration:

```sql
-- Uploaded skill/agent files
CREATE TABLE uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  file_type TEXT NOT NULL,                -- 'claude_md' | 'cursorrules' | 'mcp_config' | 'skill_file'
  file_name TEXT NOT NULL,
  content_hash TEXT NOT NULL,             -- SHA-256 of file content (for dedup)
  file_size INTEGER NOT NULL,
  line_count INTEGER NOT NULL,
  
  -- Parsing results
  is_parsed_valid BOOLEAN DEFAULT false,
  structural_markers_found TEXT[] DEFAULT '{}',  -- ['system_prompt', 'tool_definitions', 'api_refs', etc.]
  parsing_notes TEXT,
  
  -- Storage
  storage_url TEXT NOT NULL,              -- Supabase Storage URL
  loom_url TEXT,                          -- Optional walkthrough video
  
  -- Verification (inherits from vouch system)
  vouch_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(content_hash)                    -- Global uniqueness — no two users can upload same file
);

CREATE INDEX idx_uploads_profile ON uploaded_files(profile_id);
CREATE INDEX idx_uploads_hash ON uploaded_files(content_hash);

-- Impact metrics (self-reported, endorsable by peers)
CREATE TABLE impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE CASCADE,
  
  metric_text TEXT NOT NULL,              -- "Generates 500 leads/week" or "Converts at 12%"
  endorsement_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_metrics_profile ON impact_metrics(profile_id);

-- Community flags
CREATE TABLE flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES profiles(id),
  flag_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  target_profile_id UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(reporter_id, flag_type, target_id)
);

CREATE INDEX idx_flags_target ON flags(target_profile_id, status);

-- RLS
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Uploads viewable by everyone" ON uploaded_files FOR SELECT USING (true);
CREATE POLICY "Users manage own uploads" ON uploaded_files FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Metrics viewable by everyone" ON impact_metrics FOR SELECT USING (true);
CREATE POLICY "Users manage own metrics" ON impact_metrics FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Flags viewable by reporter and admins" ON flags FOR SELECT USING (reporter_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can create flags" ON flags FOR INSERT WITH CHECK (reporter_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
```
