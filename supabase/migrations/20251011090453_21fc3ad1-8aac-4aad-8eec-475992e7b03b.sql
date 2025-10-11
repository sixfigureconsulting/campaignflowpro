-- Fix search_path for handle_updated_at function to prevent search path manipulation attacks
-- This aligns with the security posture of handle_new_user which already has search_path set

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;