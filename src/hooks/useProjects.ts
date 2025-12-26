import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { projectSchema } from '@/lib/validationSchemas';

export function useProjects() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            campaigns (
              *,
              weekly_data (*)
            ),
            infrastructure (*)
          `)
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Return empty array instead of null if no projects
        return data || [];
      } catch (err) {
        throw err;
      }
    },
    enabled: !!user,
    retry: 1,
    // Don't show error for empty results
    throwOnError: false,
  });

  const createProject = useMutation({
    mutationFn: async (projectData: { name: string; client_name?: string; brand_color?: string; logo_url?: string; project_type?: string }) => {
      // Validate input
      const validated = projectSchema.parse(projectData);
      
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          user_id: user!.id,
          name: validated.name,
          client_name: validated.client_name || 'CampaignFlow Pro',
          brand_color: validated.brand_color || '#6366f1',
          logo_url: validated.logo_url || '',
          project_type: projectData.project_type || 'outbound_sales',
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
    onError: (error: any) => {
      let userMessage = error.message || "Failed to create project";
      
      if (error.message?.includes('projects_name_not_empty')) {
        userMessage = "Project name cannot be empty";
      } else if (error.message?.includes('projects_name_max_length')) {
        userMessage = "Project name must be less than 100 characters";
      }
      
      toast({
        title: "Error",
        description: userMessage,
        variant: "destructive",
      });
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; client_name?: string; brand_color?: string; logo_url?: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
    onError: (error: any) => {
      let userMessage = error.message || "Failed to update project";
      
      if (error.message?.includes('projects_name_not_empty')) {
        userMessage = "Project name cannot be empty";
      } else if (error.message?.includes('projects_name_max_length')) {
        userMessage = "Project name must be less than 100 characters";
      }
      
      toast({
        title: "Error",
        description: userMessage,
        variant: "destructive",
      });
    },
  });

  return {
    projects,
    isLoading,
    error,
    createProject,
    updateProject,
  };
}
