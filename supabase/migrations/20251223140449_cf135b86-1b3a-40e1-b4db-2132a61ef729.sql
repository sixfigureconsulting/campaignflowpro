-- Fix invitations SELECT policy to prevent email harvesting
-- Remove the policy that allows viewing by email match (security risk)
-- Keep only the policy that allows creators to view their invitations
-- Users will accept invitations via the secure accept_invitation() function

DROP POLICY IF EXISTS "Users can view invitations they created or received" ON public.invitations;

-- Create a restrictive SELECT policy - only invitation creators can view
CREATE POLICY "Invitation creators can view their invitations"
ON public.invitations
FOR SELECT
USING (invited_by = auth.uid());

-- Note: The accept_invitation() function already exists as a SECURITY DEFINER function
-- that validates the token and email match server-side, so users don't need 
-- SELECT access to accept invitations