-- Add activation_emails_sent column to track which onboarding emails have been sent
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS activation_emails_sent TEXT[] DEFAULT '{}';

-- Add weekly_score_snapshot for computing weekly score changes (Top Builders spotlight)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weekly_score_snapshot INTEGER DEFAULT 0;
