-- Add CHECK constraints for server-side validation to match client-side zod schemas

-- Campaigns table validation
ALTER TABLE campaigns
  ADD CONSTRAINT campaigns_name_length CHECK (char_length(name) > 0 AND char_length(name) <= 200),
  ADD CONSTRAINT campaigns_target_leads_valid CHECK (target_leads > 0 AND target_leads <= 1000000),
  ADD CONSTRAINT campaigns_budget_valid CHECK (allocated_budget > 0 AND allocated_budget <= 100000000);

-- Profiles table validation
ALTER TABLE profiles
  ADD CONSTRAINT profiles_email_length CHECK (email IS NULL OR char_length(email) <= 255),
  ADD CONSTRAINT profiles_name_length CHECK (full_name IS NULL OR char_length(full_name) <= 100);

-- Weekly data table validation
ALTER TABLE weekly_data
  ADD CONSTRAINT weekly_data_week_range CHECK (week_number >= 1 AND week_number <= 52),
  ADD CONSTRAINT weekly_data_leads_valid CHECK (leads_contacted >= 0 AND leads_contacted <= 100000);

-- Infrastructure table validation
ALTER TABLE infrastructure
  ADD CONSTRAINT infrastructure_mailboxes_range CHECK (mailboxes >= 0 AND mailboxes <= 1000),
  ADD CONSTRAINT infrastructure_linkedin_range CHECK (linkedin_accounts >= 0 AND linkedin_accounts <= 1000);

-- Projects table validation
ALTER TABLE projects
  ADD CONSTRAINT projects_name_length CHECK (char_length(name) > 0 AND char_length(name) <= 100),
  ADD CONSTRAINT projects_client_name_length CHECK (client_name IS NULL OR char_length(client_name) <= 100),
  ADD CONSTRAINT projects_brand_color_format CHECK (brand_color IS NULL OR brand_color ~ '^#[0-9A-Fa-f]{6}$');