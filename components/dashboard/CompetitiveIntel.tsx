import { LuTarget, LuTrendingUp, LuArrowUp } from 'react-icons/lu';

interface CompetitiveIntelProps {
  rank: number;
  totalBuilders: number;
  roleRank: number | null;
  roleTotalBuilders: number;
  roleName: string | null;
  topToolRank: { tool: string; rank: number; total: number } | null;
  scoreGap: number | null; // points needed to jump to next rank
}

export default function CompetitiveIntel({
  rank,
  totalBuilders,
  roleRank,
  roleTotalBuilders,
  roleName,
  topToolRank,
  scoreGap,
}: CompetitiveIntelProps) {
  const percentile = totalBuilders > 0 ? Math.max(1, Math.round((1 - (rank - 1) / totalBuilders) * 100)) : 0;
  const topPercent = Math.min(100, 101 - percentile);

  const rolePercentile = roleRank && roleTotalBuilders > 0
    ? Math.max(1, Math.round((1 - (roleRank - 1) / roleTotalBuilders) * 100))
    : null;
  const roleTopPercent = rolePercentile ? Math.min(100, 101 - rolePercentile) : null;

  const formatRole = (role: string) => {
    const labels: Record<string, string> = {
      marketer: 'Marketers', sdr: 'SDRs', ae: 'Account Executives',
      growth: 'Growth Engineers', founder: 'Founders', other: 'Builders',
    };
    return labels[role] || 'Builders';
  };

  const formatTool = (tool: string) =>
    tool.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="bg-surface-secondary rounded-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <LuTarget size={18} className="text-brand" />
        <h2 className="font-display text-lg font-bold">Your Position</h2>
      </div>

      <div className="space-y-3">
        {/* Overall rank */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-fg-secondary">Overall</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">#{rank} of {totalBuilders}</span>
            <span className="text-xs font-semibold text-brand bg-brand-50 px-2 py-0.5 rounded-full">
              Top {topPercent}%
            </span>
          </div>
        </div>

        {/* Role rank */}
        {roleRank && roleName && roleTotalBuilders > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-fg-secondary">Among {formatRole(roleName)}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">#{roleRank} of {roleTotalBuilders}</span>
              {roleTopPercent && (
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Top {roleTopPercent}%
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tool rank */}
        {topToolRank && topToolRank.total > 1 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-fg-secondary">{formatTool(topToolRank.tool)} users</span>
            <span className="text-sm font-bold">#{topToolRank.rank} of {topToolRank.total}</span>
          </div>
        )}

        {/* Score gap nudge */}
        {scoreGap !== null && scoreGap > 0 && scoreGap <= 50 && (
          <div className="mt-2 pt-3 border-t border-surface-border">
            <div className="flex items-center gap-2 text-sm">
              <LuArrowUp size={14} className="text-brand" />
              <span className="text-fg-secondary">
                <strong className="text-fg-primary">{scoreGap} more points</strong> to jump a rank
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
