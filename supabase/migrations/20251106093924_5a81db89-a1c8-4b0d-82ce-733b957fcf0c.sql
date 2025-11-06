-- Fix infinite recursion between projects and project_members RLS by using SECURITY DEFINER helper
-- 1) Helper function to check project membership without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_project_member(_project_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_members pm
    WHERE pm.project_id = _project_id
      AND pm.user_id = _user_id
  );
$$;

-- Ensure function ownership is set to a safe role (default owner is fine in Lovable Cloud)

-- 2) Update projects SELECT policy to use the helper, avoiding direct references to project_members
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'projects'
      AND policyname = 'Users can view own, shared, or admin views all'
  ) THEN
    DROP POLICY "Users can view own, shared, or admin views all" ON public.projects;
  END IF;
END $$;

CREATE POLICY "Users can view own, shared, or admin views all"
ON public.projects
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR (user_id = auth.uid())
  OR public.is_project_member(id, auth.uid())
);

-- Note: Other table policies referencing projects/project_members will now evaluate without recursion,
-- because projects no longer directly queries project_members with RLS during policy checks.
