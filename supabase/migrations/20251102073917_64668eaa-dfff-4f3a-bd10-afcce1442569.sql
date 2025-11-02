-- Add CHECK constraints for campaigns table
ALTER TABLE campaigns
  ADD CONSTRAINT campaigns_name_not_empty 
    CHECK (length(trim(name)) > 0),
  ADD CONSTRAINT campaigns_name_max_length 
    CHECK (length(name) <= 200),
  ADD CONSTRAINT campaigns_target_leads_positive 
    CHECK (target_leads > 0 AND target_leads <= 1000000),
  ADD CONSTRAINT campaigns_budget_positive 
    CHECK (allocated_budget > 0 AND allocated_budget <= 100000000),
  ADD CONSTRAINT campaigns_date_realistic 
    CHECK (start_date >= '2020-01-01' AND start_date <= '2050-12-31');

-- Add CHECK constraints for weekly_data table
ALTER TABLE weekly_data
  ADD CONSTRAINT weekly_week_number_valid 
    CHECK (week_number >= 1 AND week_number <= 52),
  ADD CONSTRAINT weekly_leads_nonnegative 
    CHECK (leads_contacted >= 0 AND leads_contacted <= 100000);

-- Add CHECK constraints for infrastructure table
ALTER TABLE infrastructure
  ADD CONSTRAINT infra_mailboxes_valid 
    CHECK (mailboxes >= 0 AND mailboxes <= 1000),
  ADD CONSTRAINT infra_linkedin_valid 
    CHECK (linkedin_accounts >= 0 AND linkedin_accounts <= 1000);

-- Add CHECK constraints for projects table
ALTER TABLE projects
  ADD CONSTRAINT projects_name_not_empty 
    CHECK (length(trim(name)) > 0),
  ADD CONSTRAINT projects_name_max_length 
    CHECK (length(name) <= 100);