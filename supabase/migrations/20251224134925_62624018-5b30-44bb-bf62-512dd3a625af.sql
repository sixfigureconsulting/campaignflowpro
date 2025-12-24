-- Fix weekly_data RLS policies to include shared project members

-- 1. Update SELECT policy to include project members
DROP POLICY IF EXISTS "Users can view own weekly data or admin views all" ON public.weekly_data;

CREATE POLICY "Users can view weekly data for accessible projects"
ON public.weekly_data
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM public.campaigns c
    JOIN public.projects p ON p.id = c.project_id
    WHERE c.id = weekly_data.campaign_id
      AND (
        p.user_id = auth.uid() OR
        is_project_member(p.id, auth.uid())
      )
  )
);

-- 2. Update INSERT policy to include edit members
DROP POLICY IF EXISTS "Users can insert own weekly data" ON public.weekly_data;

CREATE POLICY "Users can insert weekly data with edit access"
ON public.weekly_data
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    JOIN public.projects p ON p.id = c.project_id
    LEFT JOIN public.project_members pm ON p.id = pm.project_id AND pm.user_id = auth.uid()
    WHERE c.id = weekly_data.campaign_id
      AND (p.user_id = auth.uid() OR pm.permission_level = 'edit')
  )
);

-- 3. Update UPDATE policy to include edit members
DROP POLICY IF EXISTS "Users can update own weekly data" ON public.weekly_data;

CREATE POLICY "Users can update weekly data with edit access"
ON public.weekly_data
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    JOIN public.projects p ON p.id = c.project_id
    LEFT JOIN public.project_members pm ON p.id = pm.project_id AND pm.user_id = auth.uid()
    WHERE c.id = weekly_data.campaign_id
      AND (p.user_id = auth.uid() OR pm.permission_level = 'edit')
  )
);

-- 4. Update DELETE policy to include edit members
DROP POLICY IF EXISTS "Users can delete own weekly data" ON public.weekly_data;

CREATE POLICY "Users can delete weekly data with edit access"
ON public.weekly_data
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    JOIN public.projects p ON p.id = c.project_id
    LEFT JOIN public.project_members pm ON p.id = pm.project_id AND pm.user_id = auth.uid()
    WHERE c.id = weekly_data.campaign_id
      AND (p.user_id = auth.uid() OR pm.permission_level = 'edit')
  )
);