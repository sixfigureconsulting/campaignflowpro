import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { weeklyDataSchema } from '@/lib/validationSchemas';

export function useWeeklyData(campaignId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const upsertWeeklyData = useMutation({
    mutationFn: async (weeklyData: {
      week_number: number;
      leads_contacted: number;
    }) => {
      // Validate input
      const validated = weeklyDataSchema.parse(weeklyData);
      
      const { data, error } = await supabase
        .from('weekly_data')
        .upsert({
          campaign_id: campaignId,
          week_number: validated.week_number,
          leads_contacted: validated.leads_contacted,
        }, {
          onConflict: 'campaign_id,week_number',
          ignoreDuplicates: false,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error: any) => {
      let userMessage = error.message || "Failed to update weekly data";
      
      if (error.message?.includes('weekly_week_number_valid')) {
        userMessage = "Week number must be between 1 and 52";
      } else if (error.message?.includes('weekly_leads_nonnegative')) {
        userMessage = "Leads contacted must be a non-negative number (0-100,000)";
      }
      
      toast({
        title: "Error",
        description: userMessage,
        variant: "destructive",
      });
    },
  });

  return {
    upsertWeeklyData,
  };
}
