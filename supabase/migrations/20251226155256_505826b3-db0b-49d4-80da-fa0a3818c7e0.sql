-- Add project_type column to projects table with predefined categories
ALTER TABLE public.projects 
ADD COLUMN project_type text NOT NULL DEFAULT 'outbound_sales';

-- Add check constraint for valid project types
ALTER TABLE public.projects
ADD CONSTRAINT projects_valid_type CHECK (
  project_type IN (
    'outbound_sales', 
    'inbound_marketing', 
    'events', 
    'paid_ads', 
    'social_media', 
    'content_marketing'
  )
);