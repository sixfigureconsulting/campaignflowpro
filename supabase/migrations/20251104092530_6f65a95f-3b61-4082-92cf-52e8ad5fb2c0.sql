-- Drop the unsafe SECURITY DEFINER views that expose all user data
DROP VIEW IF EXISTS public.admin_all_projects CASCADE;
DROP VIEW IF EXISTS public.admin_all_campaigns CASCADE;
DROP VIEW IF EXISTS public.admin_system_overview CASCADE;

-- Update RLS policies on projects table to allow admin access while maintaining user isolation
DROP POLICY IF EXISTS "Users can view own and shared projects" ON public.projects;
DROP POLICY IF EXISTS "Only admins can view all projects" ON public.projects;

CREATE POLICY "Users can view own, shared, or admin views all"
ON public.projects FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role)  -- Admins see everything
  OR user_id = auth.uid()                   -- Users see own
  OR EXISTS (                               -- Users see shared
    SELECT 1 FROM public.project_members
    WHERE project_id = projects.id AND user_id = auth.uid()
  )
);

-- Update RLS policies on campaigns table
DROP POLICY IF EXISTS "Users can view own and shared campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Only admins can view all campaigns" ON public.campaigns;

CREATE POLICY "Users can view own, shared, or admin views all campaigns"
ON public.campaigns FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role)  -- Admins see everything
  OR EXISTS (                               -- Regular users see own/shared
    SELECT 1 FROM public.projects
    WHERE projects.id = campaigns.project_id
      AND (
        projects.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.project_members
          WHERE project_id = projects.id AND user_id = auth.uid()
        )
      )
  )
);

-- Update RLS policies on weekly_data table
DROP POLICY IF EXISTS "Users can view own weekly data" ON public.weekly_data;

CREATE POLICY "Users can view own weekly data or admin views all"
ON public.weekly_data FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role)  -- Admins see everything
  OR EXISTS (                               -- Regular users see own
    SELECT 1 FROM public.campaigns
    JOIN public.projects ON projects.id = campaigns.project_id
    WHERE campaigns.id = weekly_data.campaign_id
      AND projects.user_id = auth.uid()
  )
);

-- Update RLS policies on infrastructure table
DROP POLICY IF EXISTS "Users can view own infrastructure" ON public.infrastructure;

CREATE POLICY "Users can view own infrastructure or admin views all"
ON public.infrastructure FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role)  -- Admins see everything
  OR EXISTS (                               -- Regular users see own
    SELECT 1 FROM public.projects
    WHERE projects.id = infrastructure.project_id
      AND projects.user_id = auth.uid()
  )
);

-- Create safe SECURITY DEFINER function for admin statistics
-- This returns aggregated counts only, NO PII exposure
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS TABLE(
  total_users BIGINT,
  total_projects BIGINT,
  total_campaigns BIGINT,
  total_weekly_records BIGINT,
  total_infrastructure_records BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- CRITICAL: Verify caller is admin FIRST
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  -- Return aggregated statistics only (no PII, no individual records)
  RETURN QUERY
  SELECT 
    (SELECT count(*) FROM auth.users)::BIGINT,
    (SELECT count(*) FROM public.projects)::BIGINT,
    (SELECT count(*) FROM public.campaigns)::BIGINT,
    (SELECT count(*) FROM public.weekly_data)::BIGINT,
    (SELECT count(*) FROM public.infrastructure)::BIGINT;
END;
$$;

-- Grant execute permission to authenticated users (function itself checks admin role)
GRANT EXECUTE ON FUNCTION public.get_admin_stats() TO authenticated;