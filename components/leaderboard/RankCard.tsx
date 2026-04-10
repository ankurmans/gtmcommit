'use client';

import type { LeaderboardEntry } from '@/types';
import Link from 'next/link';
import { LuMedal, LuBot, LuBriefcase } from 'react-icons/lu';
import { TierBadge } from '@/components/shared/TierIcon';
import Avatar from '@/components/shared/Avatar';
import { analytics } from '@/lib/analytics';

const RANK_COLORS = ['', '#FFD700', '#C0C0C0', '#CD7F32'];

export default function RankCard({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  return (
    <Link href={`/${entry.username}`} onClick={() => analytics.leaderboardProfileClicked(entry.username, rank)} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-secondary transition-colors">
      <div className="text-lg font-bold text-fg-faint w-8 text-right">
        {rank <= 3 ? <LuMedal size={20} style={{ color: RANK_COLORS[rank] }} /> : `#${rank}`}
      </div>
      <Avatar src={entry.avatar_url} alt={entry.display_name} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate">{entry.display_name}</div>
        <div className="text-xs text-fg-muted truncate">@{entry.username}{entry.role && ` · ${entry.role}`}</div>
      </div>
      {entry.looking_for_work && (
        <span className="badge bg-green-100 text-green-700 text-[10px]"><LuBriefcase size={10} /> Open</span>
      )}
      {entry.is_agent_builder && (
        <span className="badge bg-purple-100 text-purple-700"><LuBot size={12} /></span>
      )}
      <span className="badge bg-brand-50 text-brand"><TierBadge tier={entry.gtmcommit_tier} /></span>
      <div className="text-xl font-display font-bold text-brand min-w-[3rem] text-right">{entry.gtmcommit_score}</div>
    </Link>
  );
}
