-- Fix invitations table RLS policies to prevent email harvesting
-- Drop existing SELECT policies that could be combined incorrectly
DROP POLICY IF EXISTS "Users can view own invitations" ON public.invitations;
DROP POLICY IF EXISTS "Invited users can view their own invitations" ON public.invitations;

-- Create a single, consolidated SELECT policy that is clear and secure
-- Users can ONLY see invitations they created OR invitations sent specifically to their email
CREATE POLICY "Users can view invitations they created or received"
ON public.invitations
FOR SELECT
USING (
  invited_by = auth.uid() 
  OR 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
);