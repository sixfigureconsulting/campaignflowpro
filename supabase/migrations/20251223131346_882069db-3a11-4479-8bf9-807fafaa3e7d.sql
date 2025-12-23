-- The "Deny anonymous access to profiles" policy is redundant since:
-- 1. RLS denies access by default when no matching policy exists
-- 2. The only SELECT policy for authenticated users is "Users can view own profile" which restricts to auth.uid() = id
-- 3. Anonymous users have no policy granting them SELECT access, so they're denied by default
-- Removing this redundant policy to eliminate confusion about policy ordering

DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON public.profiles;