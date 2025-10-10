-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  client_name TEXT DEFAULT 'CampaignFlow Pro',
  brand_color TEXT DEFAULT '#6366f1',
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  target_leads INTEGER NOT NULL,
  allocated_budget DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Campaigns policies
CREATE POLICY "Users can view own campaigns"
  ON public.campaigns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = campaigns.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own campaigns"
  ON public.campaigns FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = campaigns.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own campaigns"
  ON public.campaigns FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = campaigns.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Create weekly_data table
CREATE TABLE public.weekly_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  leads_contacted INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, week_number)
);

-- Enable RLS on weekly_data
ALTER TABLE public.weekly_data ENABLE ROW LEVEL SECURITY;

-- Weekly data policies
CREATE POLICY "Users can view own weekly data"
  ON public.weekly_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns
      JOIN public.projects ON projects.id = campaigns.project_id
      WHERE campaigns.id = weekly_data.campaign_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own weekly data"
  ON public.weekly_data FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.campaigns
      JOIN public.projects ON projects.id = campaigns.project_id
      WHERE campaigns.id = campaign_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own weekly data"
  ON public.weekly_data FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns
      JOIN public.projects ON projects.id = campaigns.project_id
      WHERE campaigns.id = weekly_data.campaign_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own weekly data"
  ON public.weekly_data FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns
      JOIN public.projects ON projects.id = campaigns.project_id
      WHERE campaigns.id = weekly_data.campaign_id
      AND projects.user_id = auth.uid()
    )
  );

-- Create infrastructure table
CREATE TABLE public.infrastructure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  mailboxes INTEGER NOT NULL DEFAULT 0,
  linkedin_accounts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id)
);

-- Enable RLS on infrastructure
ALTER TABLE public.infrastructure ENABLE ROW LEVEL SECURITY;

-- Infrastructure policies
CREATE POLICY "Users can view own infrastructure"
  ON public.infrastructure FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = infrastructure.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own infrastructure"
  ON public.infrastructure FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own infrastructure"
  ON public.infrastructure FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = infrastructure.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own infrastructure"
  ON public.infrastructure FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = infrastructure.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers to all tables
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER weekly_data_updated_at
  BEFORE UPDATE ON public.weekly_data
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER infrastructure_updated_at
  BEFORE UPDATE ON public.infrastructure
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();