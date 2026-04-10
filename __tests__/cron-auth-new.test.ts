import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock all dependencies needed by new cron routes
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null }),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      in: vi.fn().mockResolvedValue({}),
    })),
    auth: {
      admin: {
        getUserById: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    },
  })),
}));

vi.mock('@/lib/email/send', () => ({
  sendEmail: vi.fn(),
}));

vi.mock('@/lib/email/templates/activation', () => ({
  day3CompleteProfile: vi.fn(() => ({ subject: 'test', html: '<p>test</p>' })),
  day7ShareProfile: vi.fn(() => ({ subject: 'test', html: '<p>test</p>' })),
  day14VouchAndEngage: vi.fn(() => ({ subject: 'test', html: '<p>test</p>' })),
  ACTIVATION_STEPS: [
    { step: 'day3', daysAfterSignup: 3 },
    { step: 'day7', daysAfterSignup: 7 },
    { step: 'day14', daysAfterSignup: 14 },
  ],
}));

vi.mock('@/lib/email/templates/top-builders', () => ({
  topBuildersEmail: vi.fn(() => ({ subject: 'test', html: '<p>test</p>' })),
}));

describe('New cron endpoint auth guards', () => {
  const originalEnv = process.env.CRON_SECRET;

  beforeEach(() => {
    delete process.env.CRON_SECRET;
    vi.resetModules();
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.CRON_SECRET = originalEnv;
    } else {
      delete process.env.CRON_SECRET;
    }
  });

  it('activation: returns 500 when CRON_SECRET is not set', async () => {
    const { GET } = await import('@/app/api/cron/activation/route');
    const request = new Request('https://example.com/api/cron/activation', {
      headers: { authorization: 'Bearer undefined' },
    });
    const response = await GET(request as any);
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe('Server misconfigured');
  });

  it('activation: returns 401 with wrong secret', async () => {
    process.env.CRON_SECRET = 'correct-secret';
    vi.resetModules();
    const { GET } = await import('@/app/api/cron/activation/route');
    const request = new Request('https://example.com/api/cron/activation', {
      headers: { authorization: 'Bearer wrong-secret' },
    });
    const response = await GET(request as any);
    expect(response.status).toBe(401);
  });

  it('top-builders: returns 500 when CRON_SECRET is not set', async () => {
    vi.resetModules();
    const { GET } = await import('@/app/api/cron/top-builders/route');
    const request = new Request('https://example.com/api/cron/top-builders', {
      headers: { authorization: 'Bearer undefined' },
    });
    const response = await GET(request as any);
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe('Server misconfigured');
  });

  it('top-builders: returns 401 with wrong secret', async () => {
    process.env.CRON_SECRET = 'correct-secret';
    vi.resetModules();
    const { GET } = await import('@/app/api/cron/top-builders/route');
    const request = new Request('https://example.com/api/cron/top-builders', {
      headers: { authorization: 'Bearer wrong-secret' },
    });
    const response = await GET(request as any);
    expect(response.status).toBe(401);
  });
});
