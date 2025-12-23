-- Allow invited users to view their own invitations by matching their authenticated email
-- This enables users to see and accept invitations sent to them
CREATE POLICY "Invited users can view their own invitations"
ON public.invitations
FOR SELECT
TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);