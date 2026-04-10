import { describe, it, expect } from 'vitest';
import {
  day3CompleteProfile,
  day7ShareProfile,
  day14VouchAndEngage,
  ACTIVATION_STEPS,
} from '@/lib/email/templates/activation';

describe('Activation email templates', () => {
  describe('ACTIVATION_STEPS config', () => {
    it('has 3 steps at correct day offsets', () => {
      expect(ACTIVATION_STEPS).toHaveLength(3);
      expect(ACTIVATION_STEPS[0]).toEqual({ step: 'day3', daysAfterSignup: 3 });
      expect(ACTIVATION_STEPS[1]).toEqual({ step: 'day7', daysAfterSignup: 7 });
      expect(ACTIVATION_STEPS[2]).toEqual({ step: 'day14', daysAfterSignup: 14 });
    });
  });

  describe('day3CompleteProfile', () => {
    it('generates email with correct subject', () => {
      const email = day3CompleteProfile('Alice', 'alice', false, false);
      expect(email.subject).toContain('Alice');
      expect(email.subject).toContain('60%');
    });

    it('includes GitHub CTA when not connected', () => {
      const email = day3CompleteProfile('Alice', 'alice', false, true);
      expect(email.html).toContain('Connect GitHub');
    });

    it('omits GitHub CTA when already connected', () => {
      const email = day3CompleteProfile('Alice', 'alice', true, true);
      expect(email.html).not.toContain('Connect GitHub');
    });

    it('includes bio CTA when no bio', () => {
      const email = day3CompleteProfile('Alice', 'alice', true, false);
      expect(email.html).toContain('Add a bio');
    });

    it('omits bio CTA when bio exists', () => {
      const email = day3CompleteProfile('Alice', 'alice', true, true);
      expect(email.html).not.toContain('Add a bio');
    });

    it('always includes portfolio CTA', () => {
      const email = day3CompleteProfile('Alice', 'alice', true, true);
      expect(email.html).toContain('portfolio item');
    });

    it('includes profile edit link', () => {
      const email = day3CompleteProfile('Alice', 'alice', false, false);
      expect(email.html).toContain('/profile/edit');
    });
  });

  describe('day7ShareProfile', () => {
    it('generates email with score in subject', () => {
      const email = day7ShareProfile('Bob', 'bob', 350, 'builder');
      expect(email.subject).toContain('350');
    });

    it('includes tier label', () => {
      const email = day7ShareProfile('Bob', 'bob', 350, 'builder');
      expect(email.html).toContain('Builder');
    });

    it('includes LinkedIn bio snippet', () => {
      const email = day7ShareProfile('Bob', 'bob', 350, 'builder');
      expect(email.html).toContain('LinkedIn bio');
      expect(email.html).toContain('gtmcommit.com/bob');
    });

    it('includes profile URL', () => {
      const email = day7ShareProfile('Bob', 'bob', 350, 'builder');
      expect(email.html).toContain('/bob');
    });
  });

  describe('day14VouchAndEngage', () => {
    it('generates email with correct subject', () => {
      const email = day14VouchAndEngage('Carol', 'carol');
      expect(email.subject).toContain('Carol');
      expect(email.subject).toContain('vouch');
    });

    it('includes leaderboard link', () => {
      const email = day14VouchAndEngage('Carol', 'carol');
      expect(email.html).toContain('/leaderboard');
    });

    it('includes showcase link', () => {
      const email = day14VouchAndEngage('Carol', 'carol');
      expect(email.html).toContain('/showcase');
    });

    it('mentions Loom video walkthrough', () => {
      const email = day14VouchAndEngage('Carol', 'carol');
      expect(email.html).toContain('Loom');
    });
  });

  describe('all templates', () => {
    it('include GTM Commit branding', () => {
      const emails = [
        day3CompleteProfile('Test', 'test', false, false),
        day7ShareProfile('Test', 'test', 100, 'shipper'),
        day14VouchAndEngage('Test', 'test'),
      ];
      for (const email of emails) {
        expect(email.html).toContain('GTM Commit');
        expect(email.html).toContain('Talk is cheap. Commits aren');
      }
    });

    it('are valid HTML', () => {
      const emails = [
        day3CompleteProfile('Test', 'test', false, false),
        day7ShareProfile('Test', 'test', 100, 'shipper'),
        day14VouchAndEngage('Test', 'test'),
      ];
      for (const email of emails) {
        expect(email.html).toContain('<!DOCTYPE html>');
        expect(email.html).toContain('</html>');
      }
    });
  });
});
