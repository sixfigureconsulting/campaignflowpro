-- Fix infinite recursion in project_members RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view project members" ON public.project_members;
DROP POLICY IF EXISTS "Project owners can add members" ON public.project_members;
DROP POLICY IF EXISTS "Project owners can delete members" ON public.project_members;

-- Create simplified policies that don't cause recursion
-- Users can view members of their own projects (direct ownership check)
CREATE POLICY "Users can view project members"
ON public.project_members
FOR SELECT
USING (
  user_id = auth.uid() 
  OR project_id IN (
    SELECT id FROM public.projects WHERE user_id = auth.uid()
  )
);

-- Project owners can add members (direct ownership check)
CREATE POLICY "Project owners can add members"
ON public.project_members
FOR INSERT
WITH CHECK (
  project_id IN (
    SELECT id FROM public.projects WHERE user_id = auth.uid()
  )
);

-- Project owners can delete members (direct ownership check)
CREATE POLICY "Project owners can delete members"
ON public.project_members
FOR DELETE
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE user_id = auth.uid()
  )
);

-- Project owners can update members (for permission level changes)
CREATE POLICY "Project owners can update members"
ON public.project_members
FOR UPDATE
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE user_id = auth.uid()
  )
);