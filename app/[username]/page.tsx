import { notFound } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import Avatar from '@/components/shared/Avatar';
import ScoreCard from '@/components/profile/ScoreCard';
import GitHubStats from '@/components/profile/GitHubStats';
import PortfolioGrid from '@/components/profile/PortfolioGrid';
import VideoProofs from '@/components/profile/VideoProofs';
import ContentProofs from '@/components/profile/ContentProofs';
import CertificationsDisplay from '@/components/profile/Certifications';
import VouchSection from '@/components/profile/VouchSection';
import PoweredByBadge from '@/components/profile/PoweredByBadge';
import ShareButton from '@/components/shared/ShareButton';
import CopySummary from '@/components/profile/CopySummary';
import VisitorCTA from '@/components/profile/VisitorCTA';
import ProfileViewTracker from '@/components/profile/ProfileViewTracker';
import PlatformLinks from '@/components/profile/PlatformLinks';
import TrackedExternalLink from '@/components/profile/TrackedExternalLink';
import { LuFlame, LuGlobe, LuLinkedin, LuExternalLink, LuBot, LuBriefcase } from 'react-icons/lu';
import { FaXTwitter } from 'react-icons/fa6';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/landing/Footer';

export const dynamic = 'force-dynamic';

interface PageProps { params: Promise<{ username: string }> }

async function getProfileData(username: string) {
  noStore();
  const supabase = createAdminClient();
  const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).single();
  if (!profile) return null;

  const [portfolioRes, toolsRes, vouchesRes, totalCommitsRes, aiCommitsRes, toolCommitsRes, commitDatesRes, videosRes, contentRes, certsRes] = await Promise.all([
    supabase.from('portfolio_items').select('*').eq('profile_id', profile.id).order('display_order'),
    supabase.from('tool_declarations').select('*').eq('profile_id', profile.id),
    supabase.from('vouches').select('*, voucher:voucher_id(username, display_name, avatar_url)').eq('vouchee_id', profile.id),
    supabase.from('github_commits').select('*', { count: 'exact', head: true }).eq('profile_id', profile.id),
    supabase.from('github_commits').select('*', { count: 'exact', head: true }).eq('profile_id', profile.id).not('ai_tool_detected', 'is', null),
    supabase.from('github_commits').select('ai_tool_detected').eq('profile_id', profile.id).not('ai_tool_detected', 'is', null),
    supabase.from('github_commits').select('committed_at').eq('profile_id', profile.id),
    supabase.from('video_proofs').select('*').eq('profile_id', profile.id).order('created_at', { ascending: false }),
    supabase.from('content_proofs').select('*').eq('profile_id', profile.id).order('created_at', { ascending: false }),
    supabase.from('certifications').select('*').eq('profile_id', profile.id).order('created_at', { ascending: false }),
  ]);

  const totalCommits = totalCommitsRes.count || 0;
  const aiCommitCount = aiCommitsRes.count || 0;
  const toolCommits = toolCommitsRes.data || [];
  const toolsDetected: Record<string, number> = {};
  for (const c of toolCommits) { if (c.ai_tool_detected) toolsDetected[c.ai_tool_detected] = (toolsDetected[c.ai_tool_detected] || 0) + 1; }
  const commitDates = commitDatesRes.data || [];
  const activeWeeks = new Set(commitDates.map(c => { const d = new Date(c.committed_at); return `${d.getFullYear()}-${Math.ceil(((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7)}`; })).size;

  return {
    profile,
    portfolioItems: portfolioRes.data || [],
    tools: toolsRes.data || [],
    vouches: vouchesRes.data || [],
    videoProofs: videosRes.data || [],
    contentProofs: contentRes.data || [],
    certifications: certsRes.data || [],
    githubStats: { totalCommits, aiCommits: aiCommitCount, toolsDetected, activeWeeks },
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const data = await getProfileData(username);
  if (!data) return { title: 'Not Found' };
  const { profile } = data;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return {
    title: `${profile.display_name} — GTM Commit`,
    description: `${profile.display_name}'s GTM Commit Score: ${profile.gtmcommit_score}. ${profile.bio || 'AI-native builder.'}`,
    openGraph: { title: `${profile.display_name} — GTM Commit Score: ${profile.gtmcommit_score}`, images: [`${appUrl}/api/og/${username}`] },
    twitter: { card: 'summary_large_image', title: `${profile.display_name} — GTM Commit Score: ${profile.gtmcommit_score}`, images: [`${appUrl}/api/og/${username}`] },
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const data = await getProfileData(username);
  if (!data) notFound();
  const { profile, portfolioItems, tools, vouches, videoProofs, contentProofs, certifications, githubStats } = data;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Check auth via cookie presence (no network call — fast)
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.getAll().some(c => c.name.includes('auth-token') || c.name.includes('auth_flow'));

  // Tier-based page gradient
  const tierGradient: Record<string, string> = {
    legend: 'from-amber-50 via-amber-50/50 to-transparent',
    captain: 'from-indigo-50 via-indigo-50/40 to-transparent',
    builder: 'from-orange-50 via-orange-50/40 to-transparent',
    shipper: 'from-stone-50 via-stone-50/30 to-transparent',
    unranked: 'from-gray-50/50 to-transparent',
  };
  const gradient = tierGradient[profile.gtmcommit_tier] || tierGradient.unranked;

  return (
    <>
      <Navbar isLoggedIn={isAuthenticated} />
      <main className="min-h-screen relative">
        {/* Tier-based background gradient — fades to white */}
        <div className={`absolute inset-x-0 top-0 h-80 bg-gradient-to-b ${gradient} pointer-events-none`} aria-hidden="true" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Profile header */}
          <div className="flex items-start gap-4 sm:gap-6">
            <Avatar src={profile.avatar_url} alt={profile.display_name} size="xl" isVerified={profile.is_verified} />
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl sm:text-3xl font-bold truncate">{profile.display_name}</h1>
              <p className="text-fg-muted text-sm mt-0.5 truncate">@{profile.username}{profile.role && ` · ${profile.role}`}{profile.company && ` @ ${profile.company}`}</p>
              {profile.bio && (
                <p className="text-xs text-fg-secondary mt-1 line-clamp-2">{profile.bio}</p>
              )}
              {(profile.looking_for_work || profile.is_agent_builder || profile.current_streak > 0) && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {profile.looking_for_work && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      <LuBriefcase size={12} /> Open to Work
                    </span>
                  )}
                  {profile.is_agent_builder && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      <LuBot size={12} /> Agent Builder
                    </span>
                  )}
                  {profile.current_streak > 0 && (
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      profile.current_streak >= 4 ? 'gradient-brand text-white' : 'bg-surface-muted text-fg-secondary'
                    }`}>
                      <LuFlame size={12} /> {profile.current_streak}w streak
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Links + Share — single unified row */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Profile links */}
            {profile.website_url && (
              <TrackedExternalLink href={profile.website_url} platform="website"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-secondary border border-surface-border text-xs font-medium text-fg-secondary hover:border-brand/30 hover:text-brand transition-colors">
                <LuGlobe size={12} />
                {(() => { try { return new URL(profile.website_url).hostname.replace('www.', ''); } catch { return 'Website'; } })()}
              </TrackedExternalLink>
            )}
            {profile.twitter_handle && (
              <TrackedExternalLink href={`https://x.com/${profile.twitter_handle.replace('@', '')}`} platform="twitter" aria-label="X (Twitter)"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-secondary border border-surface-border text-fg-secondary hover:border-brand/30 hover:text-brand transition-colors">
                <FaXTwitter size={14} />
              </TrackedExternalLink>
            )}
            {profile.linkedin_url && (
              <TrackedExternalLink href={profile.linkedin_url} platform="linkedin" aria-label="LinkedIn"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-secondary border border-surface-border text-fg-secondary hover:border-brand/30 hover:text-brand transition-colors">
                <LuLinkedin size={14} />
              </TrackedExternalLink>
            )}
            <PlatformLinks platformUrls={profile.platform_urls} />

            {/* Separator */}
            {(profile.website_url || profile.twitter_handle || profile.linkedin_url || profile.platform_urls) && (
              <span className="w-px h-4 bg-surface-border" />
            )}

            {/* Share actions */}
            <ShareButton url={`${appUrl}/${profile.username}`} title={`${profile.display_name}'s GTM Commit — Score: ${profile.gtmcommit_score}`} score={profile.gtmcommit_score} tier={profile.gtmcommit_tier} />
            <CopySummary username={profile.username} />
            <a href={`/compare/${profile.username}/`} className="btn-ghost btn-sm text-xs">Compare</a>
          </div>

          {/* Score Card */}
          <div className="mt-5 sm:mt-6">
            <ScoreCard profile={profile} tools={tools} appUrl={appUrl} showHeader={false} />
          </div>
          {githubStats.totalCommits > 0 && <div className="mt-6 sm:mt-8"><GitHubStats {...githubStats} /></div>}
          {portfolioItems.length > 0 && <div className="mt-6 sm:mt-8"><PortfolioGrid items={portfolioItems} /></div>}
          {videoProofs.length > 0 && <div className="mt-6 sm:mt-8"><VideoProofs videos={videoProofs} /></div>}
          {contentProofs.length > 0 && <div className="mt-6 sm:mt-8"><ContentProofs content={contentProofs} /></div>}
          {certifications.length > 0 && <div className="mt-6 sm:mt-8"><CertificationsDisplay certifications={certifications} /></div>}
          {vouches.length > 0 && <div className="mt-6 sm:mt-8"><VouchSection vouches={vouches} /></div>}
          <div className="mt-6 sm:mt-8"><PoweredByBadge /></div>
        </div>
      </main>
      <Footer />
      {!isAuthenticated && <VisitorCTA />}
      <ProfileViewTracker profileId={profile.id} username={profile.username} />
    </>
  );
}
