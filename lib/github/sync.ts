import { createAdminClient } from '@/lib/supabase/admin';
import { fetchAllRepos, fetchCommits, fetchCommitDetail } from './api';
import { detectAITool } from './detect-ai';
import { applyGitHubAntiGaming, isSubstantiveCommit } from './anti-gaming';
import { calculateGtmCommitScore, scoreToTier } from '@/lib/scoring/calculate';
import { applyVelocityLimit } from '@/lib/scoring/velocity';
import { updateStreak } from '@/lib/gamification/streaks';
import { detectAgentBuilder } from '@/lib/gamification/agent-builder';

function sixMonthsAgo(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 6);
  return d.toISOString();
}

export async function syncGitHubData(
  profileId: string,
  accessToken: string,
  existingJobId?: string,
) {
  const supabase = createAdminClient();

  let jobId = existingJobId;
  if (jobId) {
    await supabase
      .from('github_sync_jobs')
      .update({ status: 'running', started_at: new Date().toISOString() })
      .eq('id', jobId);
  } else {
    const { data: job } = await supabase
      .from('github_sync_jobs')
      .insert({ profile_id: profileId, status: 'running', started_at: new Date().toISOString() })
      .select('id')
      .single();
    jobId = job?.id;
  }

  let reposScanned = 0;
  let commitsAnalyzed = 0;
  let aiCommitsFound = 0;

  try {
    const repos = await fetchAllRepos(accessToken);

    // Get the GitHub username for filtering
    const { data: profile } = await supabase
      .from('profiles')
      .select('github_username')
      .eq('id', profileId)
      .single();

    const githubLogin = profile?.github_username || '';

    for (const repo of repos) {
      reposScanned++;

      const rawCommits = await fetchCommits(accessToken, repo.full_name, {
        since: sixMonthsAgo(),
        author: profile?.github_username || repo.owner.login,
      });

      // Count AI commits before filtering for spoofing detection
      let repoAiCount = 0;
      for (const c of rawCommits) {
        if (detectAITool(c)) repoAiCount++;
      }

      // Apply anti-gaming filters
      const { filteredCommits } = applyGitHubAntiGaming(
        rawCommits,
        repo,
        githubLogin,
        repoAiCount
      );

      for (const commit of filteredCommits) {
        commitsAnalyzed++;
        const detection = detectAITool(commit);
        if (detection) aiCommitsFound++;

        // For AI commits without stats, fetch individual commit detail
        let additions = commit.stats?.additions || 0;
        let deletions = commit.stats?.deletions || 0;
        let filesChanged = commit.files?.length || 0;

        if (detection && additions === 0 && deletions === 0) {
          try {
            const detail = await fetchCommitDetail(accessToken, repo.full_name, commit.sha);
            additions = detail.stats?.additions || 0;
            deletions = detail.stats?.deletions || 0;
            filesChanged = detail.files?.length || 0;
          } catch {
            // Rate limit or error — skip stats for this commit
          }
        }

        // Upsert commit data
        await supabase.from('github_commits').upsert(
          {
            profile_id: profileId,
            commit_sha: commit.sha,
            repo_full_name: repo.full_name,
            repo_is_private: repo.private,
            commit_message: repo.private
              ? '[private]'
              : commit.commit.message.split('\n')[0],
            committed_at: commit.commit.author.date,
            ai_tool_detected: detection?.tool || null,
            ai_detection_method: detection?.method || null,
            ai_detection_confidence: detection?.confidence || 0,
            additions,
            deletions,
            files_changed: filesChanged,
          },
          { onConflict: 'commit_sha,profile_id' }
        );
      }

      // Write progress after each repo so the dashboard can poll live counts
      if (jobId) {
        await supabase.from('github_sync_jobs').update({
          repos_scanned: reposScanned,
          commits_analyzed: commitsAnalyzed,
          ai_commits_found: aiCommitsFound,
        }).eq('id', jobId);
      }
    }

    // Auto-verify tool declarations
    await autoVerifyTools(profileId);

    // Update streak
    await updateStreak(profileId);

    // Recalculate score
    await recalculateScore(profileId);

    // Update sync job
    if (jobId) {
      await supabase.from('github_sync_jobs').update({
        status: 'completed',
        repos_scanned: reposScanned,
        commits_analyzed: commitsAnalyzed,
        ai_commits_found: aiCommitsFound,
        completed_at: new Date().toISOString(),
      }).eq('id', jobId);
    }

    // Update profile last sync time
    await supabase
      .from('profiles')
      .update({ last_github_sync_at: new Date().toISOString() })
      .eq('id', profileId);

  } catch (error) {
    if (jobId) {
      await supabase.from('github_sync_jobs').update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        completed_at: new Date().toISOString(),
        repos_scanned: reposScanned,
        commits_analyzed: commitsAnalyzed,
        ai_commits_found: aiCommitsFound,
      }).eq('id', jobId);
    }
    throw error;
  }
}

async function autoVerifyTools(profileId: string) {
  const supabase = createAdminClient();

  // Get AI tool counts from commits
  const { data: commits } = await supabase
    .from('github_commits')
    .select('ai_tool_detected')
    .eq('profile_id', profileId)
    .not('ai_tool_detected', 'is', null);

  if (!commits) return;

  const toolCounts: Record<string, number> = {};
  for (const c of commits) {
    const tool = c.ai_tool_detected;
    if (tool) toolCounts[tool] = (toolCounts[tool] || 0) + 1;
  }

  // Upsert verified tool declarations
  for (const [toolName, count] of Object.entries(toolCounts)) {
    await supabase.from('tool_declarations').upsert(
      {
        profile_id: profileId,
        tool_name: toolName,
        is_verified: true,
        verified_commit_count: count,
        proficiency: count >= 50 ? 'expert' : count >= 20 ? 'power_user' : count >= 5 ? 'user' : 'beginner',
      },
      { onConflict: 'profile_id,tool_name' }
    );
  }
}

async function recalculateScore(profileId: string) {
  const supabase = createAdminClient();

  // Fetch all data needed for scoring
  const [commitsRes, portfolioRes, vouchesRes, toolsRes, proofsRes, videosRes, contentRes, certsRes, uploadsRes, profileRes] = await Promise.all([
    supabase.from('github_commits').select('ai_tool_detected, committed_at, repo_full_name, additions, deletions, repo_is_private').eq('profile_id', profileId),
    supabase.from('portfolio_items').select('vouch_count').eq('profile_id', profileId),
    supabase.from('vouches').select('id').eq('vouchee_id', profileId),
    supabase.from('tool_declarations').select('is_verified, tool_name').eq('profile_id', profileId),
    supabase.from('external_proofs').select('verification_status, source_type, platform_data').eq('profile_id', profileId),
    supabase.from('video_proofs').select('url_verified, duration_seconds, category, vouch_count').eq('profile_id', profileId),
    supabase.from('content_proofs').select('url_verified, platform, vouch_count').eq('profile_id', profileId),
    supabase.from('certifications').select('verification_status, issuer, vouch_count').eq('profile_id', profileId),
    supabase.from('uploaded_files').select('is_parsed_valid, vouch_count, file_type, structural_markers_found').eq('profile_id', profileId),
    supabase.from('profiles').select('gtmcommit_score, bio, avatar_url, display_name, website_url, linkedin_url, twitter_handle, role, current_streak, longest_streak').eq('id', profileId).single(),
  ]);

  const currentProfile = profileRes.data;

  const score = calculateGtmCommitScore({
    commits: commitsRes.data || [],
    portfolioItems: portfolioRes.data || [],
    vouchCount: vouchesRes.data?.length || 0,
    toolDeclarations: toolsRes.data || [],
    externalProofs: proofsRes.data || [],
    videoProofs: videosRes.data || [],
    contentProofs: contentRes.data || [],
    certifications: certsRes.data || [],
    uploadedFiles: uploadsRes.data || [],
    streak: { current: currentProfile?.current_streak || 0, longest: currentProfile?.longest_streak || 0 },
    profile: currentProfile ? {
      bio: currentProfile.bio,
      avatar_url: currentProfile.avatar_url,
      display_name: currentProfile.display_name,
      website_url: currentProfile.website_url,
      linkedin_url: currentProfile.linkedin_url,
      twitter_handle: currentProfile.twitter_handle,
      role: currentProfile.role,
    } : undefined,
  });

  const previousScore = currentProfile?.gtmcommit_score || 0;

  // Apply velocity limit: max +200 pts per 24 hours
  const finalScore = await applyVelocityLimit(profileId, score.total, previousScore);
  const tier = scoreToTier(finalScore);

  // Detect Agent Builder badge
  const agentResult = detectAgentBuilder({
    uploadedFiles: uploadsRes.data || [],
    commits: commitsRes.data || [],
    externalProofs: proofsRes.data || [],
    toolDeclarations: toolsRes.data || [],
  });

  await supabase.from('profiles').update({
    gtmcommit_score: finalScore,
    gtmcommit_tier: tier,
    score_breakdown: score,
    is_verified: (commitsRes.data || []).some(c => c.ai_tool_detected !== null),
  }).eq('id', profileId);

  // Agent builder badge (separate update — column may not exist yet)
  try {
    await supabase.from('profiles').update({
      is_agent_builder: agentResult.qualifies,
      agent_builder_signals: agentResult.signals,
    }).eq('id', profileId);
  } catch {
    // Column may not exist yet — ignore
  }
}
