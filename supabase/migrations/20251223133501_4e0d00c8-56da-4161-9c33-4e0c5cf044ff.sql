-- Remove the DELETE policy from profiles to prevent users from breaking 
-- foreign key relationships and leaving orphaned data in projects, campaigns, etc.
-- Profile deletion should only happen through controlled backend processes (e.g., account deletion flow)

DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;