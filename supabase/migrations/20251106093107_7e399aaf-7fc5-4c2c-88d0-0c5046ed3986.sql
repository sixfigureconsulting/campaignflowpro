-- Link tables with proper foreign keys so nested selects work and prevent load errors
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'campaigns_project_id_fkey'
  ) THEN
    ALTER TABLE public.campaigns
      ADD CONSTRAINT campaigns_project_id_fkey
      FOREIGN KEY (project_id)
      REFERENCES public.projects(id)
      ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'infrastructure_project_id_fkey'
  ) THEN
    ALTER TABLE public.infrastructure
      ADD CONSTRAINT infrastructure_project_id_fkey
      FOREIGN KEY (project_id)
      REFERENCES public.projects(id)
      ON DELETE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'weekly_data_campaign_id_fkey'
  ) THEN
    ALTER TABLE public.weekly_data
      ADD CONSTRAINT weekly_data_campaign_id_fkey
      FOREIGN KEY (campaign_id)
      REFERENCES public.campaigns(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- Helpful indexes for joins/filters
CREATE INDEX IF NOT EXISTS idx_campaigns_project_id ON public.campaigns(project_id);
CREATE INDEX IF NOT EXISTS idx_infrastructure_project_id ON public.infrastructure(project_id);
CREATE INDEX IF NOT EXISTS idx_weekly_data_campaign_id ON public.weekly_data(campaign_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);

-- Ensure profile and default role records are created for new users
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created_profile'
  ) THEN
    CREATE TRIGGER on_auth_user_created_profile
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created_role'
  ) THEN
    CREATE TRIGGER on_auth_user_created_role
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_role();
  END IF;
END $$;

-- Grant admin role to the specified email to safeguard access
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE u.email = 'ankit@sixfigureconsulting.co'
ON CONFLICT (user_id, role) DO NOTHING;

-- Backfill profile if missing for this user (in case they signed up before triggers)
INSERT INTO public.profiles (id, email, full_name)
SELECT u.id, u.email, COALESCE(u.raw_user_meta_data->>'full_name', '')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'ankit@sixfigureconsulting.co'
  AND p.id IS NULL;