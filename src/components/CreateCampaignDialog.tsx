import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useCampaigns } from '@/hooks/useCampaigns';

interface CreateCampaignDialogProps {
  projectId: string;
}

export function CreateCampaignDialog({ projectId }: CreateCampaignDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    targetLeads: '',
    allocatedBudget: '',
    targetOutreach: '',
  });
  
  const { createCampaign } = useCampaigns(projectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createCampaign.mutateAsync({
      name: formData.name,
      start_date: formData.startDate,
      target_leads: parseInt(formData.targetLeads),
      allocated_budget: parseFloat(formData.allocatedBudget),
      target_outreach: formData.targetOutreach ? parseInt(formData.targetOutreach) : 0,
    });

    setOpen(false);
    setFormData({ name: '', startDate: '', targetLeads: '', allocatedBudget: '', targetOutreach: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Campaign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Add a new campaign to your project. All data will be saved securely.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="SaaS Founders Outreach"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetLeads">Target Leads</Label>
            <Input
              id="targetLeads"
              type="number"
              min="1"
              value={formData.targetLeads}
              onChange={(e) => setFormData({ ...formData, targetLeads: e.target.value })}
              placeholder="1000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Allocated Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              min="0"
              step="0.01"
              value={formData.allocatedBudget}
              onChange={(e) => setFormData({ ...formData, allocatedBudget: e.target.value })}
              placeholder="5000.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetOutreach">Target Outreach</Label>
            <Input
              id="targetOutreach"
              type="number"
              min="0"
              value={formData.targetOutreach}
              onChange={(e) => setFormData({ ...formData, targetOutreach: e.target.value })}
              placeholder="500"
            />
          </div>

          <Button type="submit" className="w-full" disabled={createCampaign.isPending}>
            {createCampaign.isPending ? 'Creating...' : 'Create Campaign'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
