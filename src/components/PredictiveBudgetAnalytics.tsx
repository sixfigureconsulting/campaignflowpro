import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, Mail } from "lucide-react";

interface PredictiveBudgetAnalyticsProps {
  allocatedBudget: number;
  currentPace: {
    appointmentsPerWeek: number;
    responseRate: number;
    weeklyOutreachVolume: number;
  };
  projectedOutcome: {
    monthlyAppointments: number;
    confidence: number;
  };
}

export const PredictiveBudgetAnalytics = ({
  allocatedBudget,
  currentPace,
  projectedOutcome,
}: PredictiveBudgetAnalyticsProps) => {
  const costPerLead = 100 / 5000;
  const costPerMailbox = 3.5;
  
  const budgetForLeads = allocatedBudget * 0.7;
  const budgetForMailboxes = allocatedBudget * 0.3;
  
  const targetedLeads = Math.floor(budgetForLeads / costPerLead);
  const mailboxes = Math.floor(budgetForMailboxes / costPerMailbox);
  
  const projectedWeeklyLeads = targetedLeads / 4;
  const projectedResponseRate = currentPace.responseRate;
  const projectedWeeklyReplies = projectedWeeklyLeads * (projectedResponseRate / 100);
  const projectedMonthlyAppointments = Math.round(projectedWeeklyReplies * 4 * 0.45);

  return (
    <Card className="shadow-primary-md border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Budget & Performance Projections
        </CardTitle>
        <CardDescription>
          Estimates based on ${allocatedBudget} monthly budget and current performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget Allocation */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">Budget Allocation</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-medium">Targeted Leads</span>
              </div>
              <p className="text-2xl font-bold">{targetedLeads.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">${budgetForLeads.toFixed(2)} allocated</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span className="font-medium">Mailboxes</span>
              </div>
              <p className="text-2xl font-bold">{mailboxes}</p>
              <p className="text-xs text-muted-foreground">${budgetForMailboxes.toFixed(2)} allocated</p>
            </div>
          </div>
        </div>

        {/* Current Performance */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="font-semibold text-sm text-muted-foreground">Current Pace (Weekly Avg)</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Outreach</p>
              <p className="text-lg font-bold">{Math.round(currentPace.weeklyOutreachVolume)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Response Rate</p>
              <p className="text-lg font-bold">{currentPace.responseRate.toFixed(1)}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Appointments</p>
              <p className="text-lg font-bold">{currentPace.appointmentsPerWeek.toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* Projections */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="font-semibold text-sm text-muted-foreground">30-Day Projection</h3>
          <div className="bg-primary/5 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Projected Monthly Appointments</span>
              <span className="text-2xl font-bold text-primary">{projectedMonthlyAppointments}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Based on {projectedResponseRate.toFixed(1)}% response rate</span>
              <span className="text-muted-foreground">Confidence: {projectedOutcome.confidence}%</span>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-2 pt-4 border-t">
          <h3 className="font-semibold text-sm text-muted-foreground">Pricing Details</h3>
          <div className="text-xs space-y-1 text-muted-foreground">
            <p>• 5,000 enriched leads = $100</p>
            <p>• Mailbox cost = $3.50 per mailbox</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
