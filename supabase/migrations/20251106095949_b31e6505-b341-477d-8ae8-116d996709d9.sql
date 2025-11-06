-- Add target_outreach to campaigns table
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS target_outreach integer DEFAULT 0;
ALTER TABLE campaigns ADD CONSTRAINT campaigns_target_outreach_nonnegative CHECK (target_outreach >= 0 AND target_outreach <= 1000000);

-- Add target_outreach to weekly_data table
ALTER TABLE weekly_data ADD COLUMN IF NOT EXISTS target_outreach integer DEFAULT 0;
ALTER TABLE weekly_data ADD CONSTRAINT weekly_target_outreach_valid CHECK (target_outreach >= 0 AND target_outreach <= 100000);