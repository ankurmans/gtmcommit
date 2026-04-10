import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'full'; // 'full' | 'linkedin' | 'signature' | 'twitter'

  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // Get GitHub stats
  const [aiCommitsRes, toolCommitsRes, portfolioRes, vouchesRes, totalBuildersRes, higherScoresRes] = await Promise.all([
    supabase.from('github_commits').select('*', { count: 'exact', head: true }).eq('profile_id', profile.id).not('ai_tool_detected', 'is', null),
    supabase.from('github_commits').select('ai_tool_detected').eq('profile_id', profile.id).not('ai_tool_detected', 'is', null),
    supabase.from('portfolio_items').select('*', { count: 'exact', head: true }).eq('profile_id', profile.id),
    supabase.from('vouches').select('*', { count: 'exact', head: true }).eq('vouchee_id', profile.id),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gt('gtmcommit_score', 0),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gt('gtmcommit_score', profile.gtmcommit_score),
  ]);

  const aiCommits = aiCommitsRes.count || 0;
  const portfolioCount = portfolioRes.count || 0;
  const vouchCount = vouchesRes.count || 0;
  const totalBuilders = totalBuildersRes.count || 0;
  const rank = (higherScoresRes.count || 0) + 1;
  const percentile = totalBuilders > 1 ? Math.max(1, Math.round((1 - (rank - 1) / totalBuilders) * 100)) : 100;

  // Detect unique tools
  const toolCommits = toolCommitsRes.data || [];
  const uniqueTools = [...new Set(toolCommits.map(c => c.ai_tool_detected).filter(Boolean))];
  const toolNames = uniqueTools.map(t => formatToolName(t as string));

  const tierLabel = profile.gtmcommit_tier.charAt(0).toUpperCase() + profile.gtmcommit_tier.slice(1);
  const roleLabel = profile.role ? formatRole(profile.role) : 'GTM professional';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gtmcommit.com';
  const profileUrl = `${appUrl}/${username}`;

  const summaries: Record<string, string> = {
    full: buildFullSummary({ displayName: profile.display_name, roleLabel, tierLabel, score: profile.gtmcommit_score, aiCommits, toolNames, portfolioCount, vouchCount, percentile, profileUrl }),
    linkedin: buildLinkedInSummary({ displayName: profile.display_name, tierLabel, score: profile.gtmcommit_score, toolNames, profileUrl }),
    signature: buildSignatureSummary({ displayName: profile.display_name, tierLabel, score: profile.gtmcommit_score, profileUrl }),
    twitter: buildTwitterSummary({ tierLabel, score: profile.gtmcommit_score, aiCommits, toolNames, profileUrl }),
  };

  const summary = summaries[format] || summaries.full;

  return NextResponse.json({
    summary,
    formats: {
      full: summaries.full,
      linkedin: summaries.linkedin,
      signature: summaries.signature,
      twitter: summaries.twitter,
    },
    meta: {
      score: profile.gtmcommit_score,
      tier: profile.gtmcommit_tier,
      rank,
      percentile,
      aiCommits,
      tools: toolNames,
      portfolioCount,
      vouchCount,
    },
  });
}

function formatToolName(tool: string): string {
  const names: Record<string, string> = {
    claude_code: 'Claude Code',
    copilot: 'GitHub Copilot',
    cursor: 'Cursor',
    aider: 'Aider',
    windsurf: 'Windsurf',
    devin: 'Devin',
    lovable: 'Lovable',
    bolt: 'Bolt',
    replit: 'Replit',
    v0: 'v0',
    codex: 'Codex',
    gemini: 'Gemini',
    jules: 'Jules',
  };
  return names[tool] || tool.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatRole(role: string): string {
  const roles: Record<string, string> = {
    marketer: 'Marketer',
    sdr: 'SDR',
    ae: 'Account Executive',
    growth: 'Growth Engineer',
    founder: 'Founder',
    other: 'GTM Professional',
  };
  return roles[role] || role;
}

interface SummaryData {
  displayName: string;
  roleLabel: string;
  tierLabel: string;
  score: number;
  aiCommits: number;
  toolNames: string[];
  portfolioCount: number;
  vouchCount: number;
  percentile: number;
  profileUrl: string;
}

function buildFullSummary(d: SummaryData): string {
  const parts: string[] = [];
  parts.push(`${d.displayName} is a ${d.tierLabel}-tier ${d.roleLabel} on GTM Commit (${d.score}/1,000).`);

  if (d.aiCommits > 0 && d.toolNames.length > 0) {
    parts.push(`${d.aiCommits} verified AI-assisted commits using ${d.toolNames.join(', ')}.`);
  }

  if (d.portfolioCount > 0) {
    parts.push(`${d.portfolioCount} shipped project${d.portfolioCount !== 1 ? 's' : ''}.`);
  }

  if (d.vouchCount > 0) {
    parts.push(`Vouched by ${d.vouchCount} peer${d.vouchCount !== 1 ? 's' : ''}.`);
  }

  parts.push(`Top ${Math.min(100, 101 - d.percentile)}% of AI-native GTM professionals.`);
  parts.push(d.profileUrl);

  return parts.join(' ');
}

function buildLinkedInSummary(d: Pick<SummaryData, 'displayName' | 'tierLabel' | 'score' | 'toolNames' | 'profileUrl'>): string {
  const tools = d.toolNames.length > 0 ? ` | ${d.toolNames.join(', ')}` : '';
  return `${d.tierLabel} on GTM Commit (${d.score}/1,000)${tools} — ${d.profileUrl}`;
}

function buildSignatureSummary(d: Pick<SummaryData, 'displayName' | 'tierLabel' | 'score' | 'profileUrl'>): string {
  return `${d.displayName} | GTM Commit Score: ${d.score} (${d.tierLabel}) | ${d.profileUrl}`;
}

function buildTwitterSummary(d: Pick<SummaryData, 'tierLabel' | 'score' | 'aiCommits' | 'toolNames' | 'profileUrl'>): string {
  const tools = d.toolNames.length > 0 ? ` using ${d.toolNames.slice(0, 2).join(' & ')}` : '';
  const commits = d.aiCommits > 0 ? ` ${d.aiCommits} AI commits` : '';
  return `My GTM Commit Score: ${d.score} (${d.tierLabel}).${commits}${tools}. Talk is cheap. Commits aren't. ${d.profileUrl} #GTMCommit #AIShipped`;
}
