import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Mail } from "lucide-react";

interface BudgetAllocationProps {
  allocatedBudget: number;
}

export const BudgetAllocation = ({ allocatedBudget }: BudgetAllocationProps) => {
  // Cost constants
  const LEADS_PER_100 = 5000;
  const COST_PER_LEAD_BATCH = 100;
  const COST_PER_MAILBOX = 3.5;

  // Calculate leads based on budget
  const budgetForLeads = allocatedBudget * 0.7; // 70% for leads
  const budgetForMailboxes = allocatedBudget * 0.3; // 30% for mailboxes
  
  const targetedLeads = Math.floor((budgetForLeads / COST_PER_LEAD_BATCH) * LEADS_PER_100);
  const mailboxes = Math.floor(budgetForMailboxes / COST_PER_MAILBOX);

  return (
    <Card className="shadow-primary-md border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Budget Allocation Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-primary">${allocatedBudget}</p>
            <p className="text-xs text-muted-foreground mt-1">per month</p>
          </div>
          
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground">Targeted Leads</p>
            </div>
            <p className="text-2xl font-bold">{targetedLeads.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              ${budgetForLeads.toFixed(0)} allocated
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground">Mailboxes</p>
            </div>
            <p className="text-2xl font-bold">{mailboxes}</p>
            <p className="text-xs text-muted-foreground mt-1">
              ${budgetForMailboxes.toFixed(0)} allocated
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
          <p className="text-xs text-muted-foreground">
            <strong>Pricing:</strong> 5,000 enriched leads for $100 | $3.50 per mailbox
          </p>
        </div>
      </CardContent>
    </Card>
  );
};