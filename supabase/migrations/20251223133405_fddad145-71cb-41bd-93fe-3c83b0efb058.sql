-- Remove email column from profiles table to eliminate duplicate PII storage
-- Email addresses are already stored securely in auth.users with stronger built-in protections
-- This prevents potential enumeration attacks on the profiles table

-- First, update the trigger function to not insert email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

-- Now drop the email column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;