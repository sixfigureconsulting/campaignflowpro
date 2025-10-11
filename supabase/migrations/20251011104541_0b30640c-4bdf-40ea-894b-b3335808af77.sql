-- Fix accept_invitation function to add email verification
-- This prevents users from accepting invitations sent to different email addresses

CREATE OR REPLACE FUNCTION public.accept_invitation(invitation_token TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invitation_record RECORD;
  user_email TEXT;
BEGIN
  -- Get current user's email
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = auth.uid();

  -- Get invitation details
  SELECT * INTO invitation_record
  FROM public.invitations
  WHERE token = invitation_token
    AND status = 'pending'
    AND expires_at > now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invitation';
  END IF;

  -- CRITICAL: Verify email matches
  IF invitation_record.email != user_email THEN
    RAISE EXCEPTION 'This invitation was sent to a different email address';
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