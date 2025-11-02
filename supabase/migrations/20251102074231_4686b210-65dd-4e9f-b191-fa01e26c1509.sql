-- Create admin analytics view that bypasses RLS (admin-only access)
CREATE OR REPLACE VIEW admin_system_overview AS
SELECT 
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM projects) as total_projects,
  (SELECT COUNT(*) FROM campaigns) as total_campaigns,
  (SELECT COUNT(*) FROM weekly_data) as total_weekly_records,
  (SELECT COUNT(*) FROM infrastructure) as total_infrastructure_records;

-- Create admin-only view of all projects with owner info
CREATE OR REPLACE VIEW admin_all_projects AS
SELECT 
  p.id,
  p.name,
  p.client_name,
  p.created_at,
  p.updated_at,
  u.email as owner_email,
  p.user_id,
  (SELECT COUNT(*) FROM campaigns WHERE project_id = p.id) as campaign_count
FROM projects p
LEFT JOIN auth.users u ON p.user_id = u.id;

-- Create admin-only view of all campaigns with project info
CREATE OR REPLACE VIEW admin_all_campaigns AS
SELECT 
  c.id,
  c.name as campaign_name,
  c.start_date,
  c.target_leads,
  c.allocated_budget,
  c.created_at,
  p.name as project_name,
  p.client_name,
  u.email as owner_email,
  p.user_id,
  (SELECT COUNT(*) FROM weekly_data WHERE campaign_id = c.id) as weekly_data_count
FROM campaigns c
JOIN projects p ON c.project_id = p.id
LEFT JOIN auth.users u ON p.user_id = u.id;

-- Grant execute on has_role function to authenticated users
GRANT EXECUTE ON FUNCTION has_role TO authenticated;

-- Create RLS policy for admin_all_projects view
CREATE POLICY "Only admins can view all projects"
ON projects FOR SELECT
USING (
  has_role(auth.uid(), 'admin')
);

-- Create RLS policy for admin_all_campaigns view  
CREATE POLICY "Only admins can view all campaigns"
ON campaigns FOR SELECT
USING (
  has_role(auth.uid(), 'admin')
);