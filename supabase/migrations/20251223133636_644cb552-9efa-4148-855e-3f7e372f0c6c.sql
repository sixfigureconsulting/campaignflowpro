-- Add UPDATE policy for invitations to allow proper status management
-- Only invitation creators can update/revoke their invitations
CREATE POLICY "Invitation creators can update own invitations"
ON public.invitations
FOR UPDATE
TO authenticated
USING (invited_by = auth.uid())
WITH CHECK (invited_by = auth.uid());