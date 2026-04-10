// ============================================================
// CORE ENTITY TYPES
// ============================================================

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  twitter_handle: string | null;
  role: ProfileRole | null;
  company: string | null;
  looking_for_work: boolean;
  github_username: string | null;
  github_connected_at: string | null;
  github_scopes: string[] | null;
  last_github_sync_at: string | null;
  gtmcommit_score: number;
  gtmcommit_tier: GtmCommitTier;
  score_breakdown: ScoreBreakdown;
  is_featured: boolean;
  is_verified: boolean;
  is_agent_builder: boolean;
  agent_builder_signals: string[];
  profile_completeness: number;
  activation_emails_sent: string[];
  created_at: string;
  updated_at: string;
}

export type ProfileRole =
  | 'marketer'
  | 'sdr'
  | 'ae'
  | 'growth'
  | 'founder'
  | 'other';

export type GtmCommitTier =
  | 'unranked'
  | 'shipper'
  | 'builder'
  | 'captain'
  | 'legend';

export interface ScoreBreakdown {
  tier1: number;
  tier2: number;
  tier3: number;
  total: number;
  detail: {
    githubCommits: number;
    commitImpact: number;
    privateRepoBonus: number;
    platformDeploys: number;
    certsTier1: number;
    toolDiversity: number;
    consistency: number;
    streak: number;
    vouchedPortfolio: number;
    vouchedUploads: number;
    vouchedVideos: number;
    vouchedContent: number;
    certsTier2: number;
    unvouchedPortfolio: number;
    unvouchedUploads: number;
    unvouchedVideos: number;
    unvouchedContent: number;
    unrecognizedCerts: number;
    toolDeclarations: number;
    profileCompleteness: number;
  };
}

// Legacy 4-bucket format for backward compat in DB storage
export interface LegacyScoreBreakdown {
  github: number;
  portfolio: number;
  vouches: number;
  tools: number;
}

// ============================================================
// GITHUB COMMITS
// ============================================================

export interface GitHubCommit {
  id: string;
  profile_id: string;
  commit_sha: string;
  repo_full_name: string;
  repo_is_private: boolean;
  commit_message: string | null;
  committed_at: string;
  ai_tool_detected: AITool | null;
  ai_detection_method: AIDetectionMethod | null;
  ai_detection_confidence: number;
  additions: number;
  deletions: number;
  files_changed: number;
  synced_at: string;
}

export type AITool =
  | 'claude_code'
  | 'copilot'
  | 'cursor'
  | 'aider'
  | 'windsurf'
  | 'devin'
  | 'lovable'
  | 'bolt'
  | 'replit'
  | 'v0'
  | 'base44'
  | 'codex'
  | 'jules'
  | 'gemini'
  | 'cody'
  | 'pythagora'
  | 'same_dev'
  | 'firebase_studio';

export type AIDetectionMethod =
  | 'co_author_trailer'
  | 'bot_commit'
  | 'branch_name'
  | 'cursorrules'
  | 'commit_message'
  | 'author_email';

// ============================================================
// PORTFOLIO ITEMS
// ============================================================

export interface PortfolioItem {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  url: string | null;
  screenshot_url: string | null;
  category: PortfolioCategory | null;
  tools_used: string[];
  verification_status: VerificationStatus;
  vouch_count: number;
  is_pinned: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type PortfolioCategory =
  | 'landing_page'
  | 'automation'
  | 'outbound_system'
  | 'analytics'
  | 'app'
  | 'other';

export type VerificationStatus =
  | 'self_reported'
  | 'vouched'
  | 'verified';

// ============================================================
// TOOL DECLARATIONS
// ============================================================

export interface ToolDeclaration {
  id: string;
  profile_id: string;
  tool_name: string;
  proficiency: ToolProficiency;
  is_verified: boolean;
  verified_commit_count: number;
  declared_at: string;
}

export type ToolProficiency =
  | 'beginner'
  | 'user'
  | 'power_user'
  | 'expert';

// ============================================================
// VOUCHES
// ============================================================

export interface Vouch {
  id: string;
  voucher_id: string;
  vouchee_id: string;
  portfolio_item_id: string | null;
  message: string | null;
  created_at: string;
}

// ============================================================
// GITHUB SYNC JOBS
// ============================================================

export interface GitHubSyncJob {
  id: string;
  profile_id: string;
  status: SyncJobStatus;
  repos_scanned: number;
  commits_analyzed: number;
  ai_commits_found: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export type SyncJobStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed';

// ============================================================
// EXTERNAL PROOFS
// ============================================================

export interface ExternalProof {
  id: string;
  profile_id: string;
  source_type: ProofSourceType;
  project_url: string;
  project_name: string | null;
  platform_data: Record<string, unknown>;
  verification_status: ProofVerificationStatus;
  verification_method: string | null;
  verified_at: string | null;
  screenshot_url: string | null;
  is_pinned: boolean;
  display_order: number;
  proof_score: number;
  created_at: string;
  updated_at: string;
}

export type ProofSourceType =
  | 'vercel'
  | 'lovable'
  | 'bolt'
  | 'v0'
  | 'replit'
  | 'railway'
  | 'netlify'
  | 'fly'
  | 'figma'
  | 'clay'
  | 'n8n'
  | 'make'
  | 'custom_url';

export type ProofVerificationStatus =
  | 'pending'
  | 'verified'
  | 'failed'
  | 'manual';

// ============================================================
// API RESPONSE HELPERS
// ============================================================

export interface PublicProfile extends Omit<Profile, 'user_id' | 'github_connected_at' | 'github_scopes' | 'last_github_sync_at'> {
  portfolio_items: PortfolioItem[];
  tool_declarations: ToolDeclaration[];
  vouches_received: Vouch[];
  external_proofs: ExternalProof[];
  video_proofs: VideoProof[];
  content_proofs: ContentProof[];
  certifications: Certification[];
  github_stats: {
    total_commits: number;
    ai_commits: number;
    tools_detected: Record<string, number>;
    active_weeks: number;
  };
}

export interface LeaderboardEntry {
  username: string;
  display_name: string;
  avatar_url: string | null;
  role: ProfileRole | null;
  company: string | null;
  gtmcommit_score: number;
  gtmcommit_tier: GtmCommitTier;
  top_tools: string[];
  is_agent_builder: boolean;
  looking_for_work?: boolean;
}

// ============================================================
// GITHUB API TYPES (raw from GitHub)
// ============================================================

export interface GitHubAPICommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email?: string;
      date: string;
    };
    committer?: {
      name?: string;
      email?: string;
      date?: string;
    };
    tree: {
      sha: string;
    };
  };
  committer: {
    login: string;
  } | null;
  stats?: {
    additions: number;
    deletions: number;
  };
  files?: { filename: string }[];
}

export interface GitHubAPIRepo {
  full_name: string;
  private: boolean;
  fork?: boolean;
  created_at?: string;
  size?: number;
  owner: {
    login: string;
  };
  pushed_at: string;
}

// ============================================================
// UPLOADED FILES
// ============================================================

export interface UploadedFile {
  id: string;
  profile_id: string;
  file_type: UploadFileType;
  file_name: string;
  content_hash: string;
  file_size: number;
  line_count: number;
  is_parsed_valid: boolean;
  structural_markers_found: string[];
  parsing_notes: string | null;
  storage_url: string;
  loom_url: string | null;
  vouch_count: number;
  created_at: string;
}

export type UploadFileType = 'claude_md' | 'cursorrules' | 'mcp_config' | 'skill_file';

// ============================================================
// IMPACT METRICS
// ============================================================

export interface ImpactMetric {
  id: string;
  profile_id: string;
  portfolio_item_id: string | null;
  metric_text: string;
  endorsement_count: number;
  created_at: string;
}

// ============================================================
// COMMUNITY FLAGS
// ============================================================

export interface Flag {
  id: string;
  reporter_id: string;
  flag_type: FlagType;
  target_id: string;
  target_profile_id: string;
  reason: FlagReason;
  description: string | null;
  status: FlagStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export type FlagType =
  | 'profile'
  | 'portfolio_item'
  | 'upload'
  | 'vouch'
  | 'video_proof'
  | 'content_proof'
  | 'certification';

export type FlagReason =
  | 'fake_commits'
  | 'copied_file'
  | 'fake_vouch'
  | 'spam'
  | 'other';

export type FlagStatus = 'pending' | 'reviewed_clear' | 'reviewed_removed';

// ============================================================
// ANTI-GAMING TYPES
// ============================================================

export interface SpoofingSignal {
  isSuspicious: boolean;
  signals: {
    lowVariety: boolean;
    hasBurst: boolean;
    singleToolHighVolume: boolean;
    unrealisticRatio: boolean;
  };
}

// ============================================================
// VIDEO PROOFS
// ============================================================

export interface VideoProof {
  id: string;
  profile_id: string;
  url: string;
  platform: VideoPlatform;
  title: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  category: VideoCategory | null;
  tools_mentioned: string[];
  description: string | null;
  url_verified: boolean;
  vouch_count: number;
  created_at: string;
}

export type VideoPlatform = 'loom' | 'youtube' | 'vimeo';

export type VideoCategory = 'workflow_walkthrough' | 'tool_demo' | 'build_session';

// ============================================================
// CONTENT PROOFS
// ============================================================

export interface ContentProof {
  id: string;
  profile_id: string;
  url: string;
  platform: ContentPlatform;
  title: string | null;
  published_at: string | null;
  estimated_word_count: number | null;
  tools_mentioned: string[];
  description: string | null;
  url_verified: boolean;
  vouch_count: number;
  created_at: string;
}

export type ContentPlatform =
  | 'blog'
  | 'twitter'
  | 'linkedin'
  | 'substack'
  | 'beehiiv'
  | 'medium'
  | 'github'
  | 'other';

// ============================================================
// CERTIFICATIONS
// ============================================================

export interface Certification {
  id: string;
  profile_id: string;
  cert_name: string;
  issuer: string;
  cert_url: string;
  cert_id: string | null;
  issued_at: string | null;
  verification_status: CertVerificationStatus;
  verification_method: string | null;
  verified_at: string | null;
  vouch_count: number;
  created_at: string;
}

export type CertVerificationStatus = 'auto_verified' | 'vouch_verified' | 'pending';

