import { describe, it, expect } from 'vitest';
import { topBuildersEmail } from '@/lib/email/templates/top-builders';

describe('Top Builders email template', () => {
  const topMovers = [
    { display_name: 'Alice', username: 'alice', score: 600, tier: 'captain', score_change: 150 },
    { display_name: 'Bob', username: 'bob', score: 400, tier: 'builder', score_change: 100 },
    { display_name: 'Carol', username: 'carol', score: 300, tier: 'builder', score_change: 75 },
  ];

  const topOverall = [
    { display_name: 'Zara', username: 'zara', score: 800, tier: 'legend', score_change: 0 },
    { display_name: 'Alice', username: 'alice', score: 600, tier: 'captain', score_change: 0 },
    { display_name: 'Dan', username: 'dan', score: 550, tier: 'captain', score_change: 0 },
    { display_name: 'Bob', username: 'bob', score: 400, tier: 'builder', score_change: 0 },
    { display_name: 'Eve', username: 'eve', score: 350, tier: 'builder', score_change: 0 },
  ];

  it('generates email with correct subject', () => {
    const email = topBuildersEmail('Test User', topMovers, topOverall, 50);
    expect(email.subject).toContain('top builders');
  });

  it('includes total builder count', () => {
    const email = topBuildersEmail('Test User', topMovers, topOverall, 50);
    expect(email.html).toContain('50 builders');
  });

  it('shows top 3 movers with score changes', () => {
    const email = topBuildersEmail('Test User', topMovers, topOverall, 50);
    expect(email.html).toContain('Alice');
    expect(email.html).toContain('Bob');
    expect(email.html).toContain('Carol');
    expect(email.html).toContain('+150');
    expect(email.html).toContain('+100');
    expect(email.html).toContain('+75');
  });

  it('shows top 5 overall', () => {
    const email = topBuildersEmail('Test User', topMovers, topOverall, 50);
    expect(email.html).toContain('Zara');
    expect(email.html).toContain('800');
    expect(email.html).toContain('Legend');
  });

  it('includes medal emojis for top 3 movers', () => {
    const email = topBuildersEmail('Test User', topMovers, topOverall, 50);
    expect(email.html).toContain('🥇');
    expect(email.html).toContain('🥈');
    expect(email.html).toContain('🥉');
  });

  it('includes leaderboard link', () => {
    const email = topBuildersEmail('Test User', topMovers, topOverall, 50);
    expect(email.html).toContain('/leaderboard');
  });

  it('includes GTM Commit branding', () => {
    const email = topBuildersEmail('Test User', topMovers, topOverall, 50);
    expect(email.html).toContain('GTM Commit');
    expect(email.html).toContain('Talk is cheap. Commits aren');
  });

  it('includes profile links for builders', () => {
    const email = topBuildersEmail('Test User', topMovers, topOverall, 50);
    expect(email.html).toContain('/alice');
    expect(email.html).toContain('/bob');
    expect(email.html).toContain('/zara');
  });

  it('handles empty movers list', () => {
    const email = topBuildersEmail('Test User', [], topOverall, 50);
    expect(email.html).toContain('GTM Commit');
    // Should still render, just with empty mover table
    expect(email.html).not.toContain('🥇');
  });

  it('is valid HTML', () => {
    const email = topBuildersEmail('Test User', topMovers, topOverall, 50);
    expect(email.html).toContain('<!DOCTYPE html>');
    expect(email.html).toContain('</html>');
  });
});
