const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://gtmcommit.com';

interface TopBuilder {
  display_name: string;
  username: string;
  score: number;
  tier: string;
  score_change: number;
}

export function topBuildersEmail(
  recipientName: string,
  topMovers: TopBuilder[],
  topOverall: TopBuilder[],
  totalBuilders: number,
): { subject: string; html: string } {
  const topMoverRows = topMovers
    .slice(0, 3)
    .map((b, i) => {
      const medal = ['🥇', '🥈', '🥉'][i];
      const tierLabel = b.tier.charAt(0).toUpperCase() + b.tier.slice(1);
      return `
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#1a1a1a">${medal} <a href="${APP_URL}/${b.username}" style="color:#FF5C00;text-decoration:none;font-weight:600">${b.display_name}</a></td>
          <td style="padding:8px 0;font-size:14px;color:#666;text-align:center">${tierLabel}</td>
          <td style="padding:8px 0;font-size:14px;color:#1a1a1a;text-align:right;font-weight:700">${b.score}</td>
          <td style="padding:8px 0;font-size:14px;color:#16a34a;text-align:right;font-weight:600">+${b.score_change}</td>
        </tr>`;
    })
    .join('');

  const topOverallRows = topOverall
    .slice(0, 5)
    .map((b, i) => {
      const tierLabel = b.tier.charAt(0).toUpperCase() + b.tier.slice(1);
      return `
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#666">#${i + 1}</td>
          <td style="padding:6px 0;font-size:13px;color:#1a1a1a"><a href="${APP_URL}/${b.username}" style="color:#FF5C00;text-decoration:none">${b.display_name}</a></td>
          <td style="padding:6px 0;font-size:13px;color:#666;text-align:center">${tierLabel}</td>
          <td style="padding:6px 0;font-size:13px;color:#1a1a1a;text-align:right;font-weight:700">${b.score}</td>
        </tr>`;
    })
    .join('');

  return {
    subject: `This week's top builders on GTM Commit`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f8fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px">
    <div style="background:#fff;border-radius:16px;padding:40px;border:1px solid #f3f4f6">
      <div style="text-align:center;margin-bottom:24px">
        <div style="display:inline-block;background:linear-gradient(135deg,#FF5C00,#FF8533);color:#fff;font-weight:800;font-size:18px;padding:8px 20px;border-radius:20px">GTM Commit</div>
      </div>
      <h1 style="font-size:22px;font-weight:700;color:#1a1a1a;text-align:center;margin:0 0 4px">Top Builders This Week</h1>
      <p style="color:#666;text-align:center;margin:0 0 24px;font-size:14px">${totalBuilders} builders on the platform</p>

      <!-- Top Movers -->
      <div style="margin-bottom:24px">
        <h2 style="font-size:15px;font-weight:700;color:#1a1a1a;margin:0 0 12px">🔥 Biggest Movers</h2>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="border-bottom:1px solid #f3f4f6">
              <th style="text-align:left;padding:4px 0;font-size:11px;color:#999;font-weight:600;text-transform:uppercase">Builder</th>
              <th style="text-align:center;padding:4px 0;font-size:11px;color:#999;font-weight:600;text-transform:uppercase">Tier</th>
              <th style="text-align:right;padding:4px 0;font-size:11px;color:#999;font-weight:600;text-transform:uppercase">Score</th>
              <th style="text-align:right;padding:4px 0;font-size:11px;color:#999;font-weight:600;text-transform:uppercase">Change</th>
            </tr>
          </thead>
          <tbody>${topMoverRows}</tbody>
        </table>
      </div>

      <!-- Top Overall -->
      <div style="margin-bottom:24px">
        <h2 style="font-size:15px;font-weight:700;color:#1a1a1a;margin:0 0 12px">🏆 Leaderboard Top 5</h2>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="border-bottom:1px solid #f3f4f6">
              <th style="text-align:left;padding:4px 0;font-size:11px;color:#999;font-weight:600">#</th>
              <th style="text-align:left;padding:4px 0;font-size:11px;color:#999;font-weight:600;text-transform:uppercase">Builder</th>
              <th style="text-align:center;padding:4px 0;font-size:11px;color:#999;font-weight:600;text-transform:uppercase">Tier</th>
              <th style="text-align:right;padding:4px 0;font-size:11px;color:#999;font-weight:600;text-transform:uppercase">Score</th>
            </tr>
          </thead>
          <tbody>${topOverallRows}</tbody>
        </table>
      </div>

      <div style="text-align:center">
        <a href="${APP_URL}/leaderboard" style="display:inline-block;background:#FF5C00;color:#fff;padding:12px 32px;border-radius:999px;font-weight:600;font-size:15px;text-decoration:none">View Full Leaderboard</a>
      </div>
      <p style="color:#ccc;font-size:12px;text-align:center;margin-top:32px">Talk is cheap. Commits aren't.</p>
    </div>
  </div>
</body>
</html>`,
  };
}
