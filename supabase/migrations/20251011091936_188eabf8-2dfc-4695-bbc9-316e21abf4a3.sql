-- Add admin role for master user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'ankit@sixfigureconsulting.co'
ON CONFLICT (user_id, role) DO NOTHING;

-- Create invitations table for user invites
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  permission_level TEXT NOT NULL CHECK (permission_level IN ('view', 'edit')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  token TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days'),
  UNIQUE(email, project_id)
);

-- Enable RLS on invitations
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Users can view invitations they created
CREATE POLICY "Users can view own invitations"
ON public.invitations FOR SELECT
USING (invited_by = auth.uid());

-- Users can create invitations for their projects
CREATE POLICY "Users can create invitations for own projects"
ON public.invitations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = project_id AND user_id = auth.uid()
  )
);

-- Users can delete their own invitations
CREATE POLICY "Users can delete own invitations"
ON public.invitations FOR DELETE
USING (invited_by = auth.uid());

-- Create project_members table for access control
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_level TEXT NOT NULL CHECK (permission_level IN ('view', 'edit', 'owner')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Enable RLS on project_members
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Anyone can view members of projects they have access to
CREATE POLICY "Users can view project members"
ON public.project_members FOR SELECT
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = project_id AND user_id = auth.uid()
  )
);

-- Project owners can add members
CREATE POLICY "Project owners can add members"
ON public.project_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = project_id AND user_id = auth.uid()
  )
);

-- Project owners can remove members
CREATE POLICY "Project owners can delete members"
ON public.project_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = project_id AND user_id = auth.uid()
  )
);

-- Update projects RLS to include shared access
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
CREATE POLICY "Users can view own and shared projects"
ON public.projects FOR SELECT
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_id = projects.id AND user_id = auth.uid()
  )
);

-- Update campaigns RLS to include shared access
DROP POLICY IF EXISTS "Users can view own campaigns" ON public.campaigns;
CREATE POLICY "Users can view own and shared campaigns"
ON public.campaigns FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = campaigns.project_id AND (
      user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.project_members
        WHERE project_id = projects.id AND user_id = auth.uid()
      )
    )
  )
);

-- Only allow edits for users with edit permission
DROP POLICY IF EXISTS "Users can update own campaigns" ON public.campaigns;
CREATE POLICY "Users can update campaigns with edit access"
ON public.campaigns FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    LEFT JOIN public.project_members pm ON p.id = pm.project_id AND pm.user_id = auth.uid()
    WHERE p.id = campaigns.project_id AND (
      p.user_id = auth.uid() OR
      pm.permission_level = 'edit'
    )
  )
);

-- Function to accept invitation
CREATE OR REPLACE FUNCTION public.accept_invitation(invitation_token TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invitation_record RECORD;
BEGIN
  -- Get invitation details
  SELECT * INTO invitation_record
  FROM public.invitations
  WHERE token = invitation_token
    AND status = 'pending'
    AND expires_at > now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invitation';
  END IF;

  -- Add user to project_members
  INSERT INTO public.project_members (project_id, user_id, permission_level)
  VALUES (invitation_record.project_id, auth.uid(), invitation_record.permission_level)
  ON CONFLICT (project_id, user_id) DO UPDATE
  SET permission_level = EXCLUDED.permission_level;

  -- Mark invitation as accepted
  UPDATE public.invitations
  SET status = 'accepted'
  WHERE token = invitation_token;
END;
$$;