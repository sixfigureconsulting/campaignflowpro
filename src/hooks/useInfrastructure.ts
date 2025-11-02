import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { infrastructureSchema } from '@/lib/validationSchemas';

export function useInfrastructure(projectId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const upsertInfrastructure = useMutation({
    mutationFn: async (infraData: {
      mailboxes: number;
      linkedin_accounts: number;
    }) => {
      // Validate input
      const validated = infrastructureSchema.parse(infraData);
      
      const { data, error } = await supabase
        .from('infrastructure')
        .upsert({
          project_id: projectId,
          mailboxes: validated.mailboxes,
          linkedin_accounts: validated.linkedin_accounts,
        }, {
          onConflict: 'project_id',
          ignoreDuplicates: false,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Infrastructure updated successfully",
      });
    },
    onError: (error: any) => {
      let userMessage = error.message || "Failed to update infrastructure";
      
      if (error.message?.includes('infra_mailboxes_valid')) {
        userMessage = "Mailboxes must be a non-negative number (0-1,000)";
      } else if (error.message?.includes('infra_linkedin_valid')) {
        userMessage = "LinkedIn accounts must be a non-negative number (0-1,000)";
      }
      
      toast({
        title: "Error",
        description: userMessage,
        variant: "destructive",
      });
    },
  });

  return {
    upsertInfrastructure,
  };
}
