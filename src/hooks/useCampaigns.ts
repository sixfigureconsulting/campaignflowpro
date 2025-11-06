import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { campaignSchema } from '@/lib/validationSchemas';

export function useCampaigns(projectId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCampaign = useMutation({
    mutationFn: async (campaignData: {
      name: string;
      start_date: string;
      target_leads: number;
      allocated_budget: number;
      target_outreach?: number;
    }) => {
      // Validate input
      const validated = campaignSchema.parse(campaignData);
      
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{
          project_id: projectId,
          name: validated.name,
          start_date: validated.start_date,
          target_leads: validated.target_leads,
          allocated_budget: validated.allocated_budget,
          target_outreach: validated.target_outreach || 0,
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
        description: "Campaign created successfully",
      });
    },
    onError: (error: any) => {
      let userMessage = error.message || "Failed to create campaign";
      
      if (error.message?.includes('campaigns_name_not_empty')) {
        userMessage = "Campaign name cannot be empty";
      } else if (error.message?.includes('campaigns_name_max_length')) {
        userMessage = "Campaign name must be less than 200 characters";
      } else if (error.message?.includes('campaigns_target_leads_positive')) {
        userMessage = "Target leads must be a positive number (1-1,000,000)";
      } else if (error.message?.includes('campaigns_budget_positive')) {
        userMessage = "Budget must be a positive amount (1-100,000,000)";
      } else if (error.message?.includes('campaigns_date_realistic')) {
        userMessage = "Start date must be between 2020 and 2050";
      }
      
      toast({
        title: "Error",
        description: userMessage,
        variant: "destructive",
      });
    },
  });

  const updateCampaign = useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string;
      name?: string;
      start_date?: string;
      target_leads?: number;
      allocated_budget?: number;
    }) => {
      const { data, error } = await supabase
        .from('campaigns')
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
        description: "Campaign updated successfully",
      });
    },
    onError: (error: any) => {
      let userMessage = error.message || "Failed to update campaign";
      
      if (error.message?.includes('campaigns_name_not_empty')) {
        userMessage = "Campaign name cannot be empty";
      } else if (error.message?.includes('campaigns_name_max_length')) {
        userMessage = "Campaign name must be less than 200 characters";
      } else if (error.message?.includes('campaigns_target_leads_positive')) {
        userMessage = "Target leads must be a positive number (1-1,000,000)";
      } else if (error.message?.includes('campaigns_budget_positive')) {
        userMessage = "Budget must be a positive amount (1-100,000,000)";
      } else if (error.message?.includes('campaigns_date_realistic')) {
        userMessage = "Start date must be between 2020 and 2050";
      }
      
      toast({
        title: "Error",
        description: userMessage,
        variant: "destructive",
      });
    },
  });

  const deleteCampaign = useMutation({
    mutationFn: async (campaignId: string) => {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete campaign",
        variant: "destructive",
      });
    },
  });

  return {
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
}
