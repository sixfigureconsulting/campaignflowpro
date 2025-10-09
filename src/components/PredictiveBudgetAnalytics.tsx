import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, Mail } from "lucide-react";

interface PredictiveBudgetAnalyticsProps {
  allocatedBudget?: number;
  yearlyGoals?: {
    targetAppointments: number;
    targetLeads: number;
  };
  currentPerformance?: {
    totalAppointments: number;
    totalLeads: number;
    totalReplies: number;
    weeksCompleted: number;
  };
  currentPace?: {
    appointmentsPerWeek: number;
    responseRate: number;
    weeklyOutreachVolume: number;
  };
}

export const PredictiveBudgetAnalytics = ({
  allocatedBudget = 0,
  yearlyGoals = { targetAppointments: 0, targetLeads: 0 },
  currentPerformance = { totalAppointments: 0, totalLeads: 0, totalReplies: 0, weeksCompleted: 1 },
  currentPace = { appointmentsPerWeek: 0, responseRate: 0, weeklyOutreachVolume: 0 },
}: PredictiveBudgetAnalyticsProps) => {
  const costPerLead = 100 / 5000;
  const costPerMailbox = 3.5;
  
  // Calculate weekly targets based on yearly goals (52 weeks in a year)
  const weeksInYear = 52;
  const weeklyAppointmentTarget = (yearlyGoals?.targetAppointments || 0) / weeksInYear;
  const weeklyLeadsTarget = (yearlyGoals?.targetLeads || 0) / weeksInYear;
  
  // Calculate deficit accounting for accumulation
  const weeksCompleted = currentPerformance?.weeksCompleted || 1;
  const expectedAppointmentsByNow = weeklyAppointmentTarget * weeksCompleted;
  const appointmentDeficit = Math.max(0, expectedAppointmentsByNow - (currentPerformance?.totalAppointments || 0));
  
  // Remaining weeks in the year
  const remainingWeeks = weeksInYear - weeksCompleted;
  
  // Adjusted weekly target to catch up
  const adjustedWeeklyTarget = remainingWeeks > 0 
    ? ((yearlyGoals?.targetAppointments || 0) - (currentPerformance?.totalAppointments || 0)) / remainingWeeks 
    : 0;
  
  // Budget calculations
  const yearlyBudgetForLeads = allocatedBudget * 0.7;
  const yearlyBudgetForMailboxes = allocatedBudget * 0.3;
  
  const targetedLeadsYearly = Math.floor(yearlyBudgetForLeads / costPerLead);
  const mailboxes = Math.floor(yearlyBudgetForMailboxes / costPerMailbox);
  
  // Progress tracking
  const appointmentProgress = (yearlyGoals?.targetAppointments || 0) > 0 
    ? ((currentPerformance?.totalAppointments || 0) / (yearlyGoals?.targetAppointments || 1)) * 100 
    : 0;
  const leadsProgress = (yearlyGoals?.targetLeads || 0) > 0 
    ? ((currentPerformance?.totalLeads || 0) / (yearlyGoals?.targetLeads || 1)) * 100 
    : 0;

  return (
    <Card className="shadow-primary-md border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Budget & Performance Projections
        </CardTitle>
        <CardDescription>
          Yearly budget: ${allocatedBudget.toLocaleString()} | Weeks completed: {weeksCompleted} of {weeksInYear}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Tracking */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">Goal Progress</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Appointments</span>
                <span className="font-semibold">{currentPerformance?.totalAppointments || 0} / {yearlyGoals?.targetAppointments || 0}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2 transition-all" 
                  style={{ width: `${Math.min(appointmentProgress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{appointmentProgress.toFixed(1)}% complete</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Leads</span>
                <span className="font-semibold">{currentPerformance?.totalLeads || 0} / {yearlyGoals?.targetLeads || 0}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2 transition-all" 
                  style={{ width: `${Math.min(leadsProgress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{leadsProgress.toFixed(1)}% complete</p>
            </div>
          </div>
        </div>

        {/* Deficit & Catch-Up Plan */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="font-semibold text-sm text-muted-foreground">Deficit Analysis</h3>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Appointment Deficit</span>
              <span className="text-2xl font-bold text-destructive">{appointmentDeficit.toFixed(1)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Behind schedule by {appointmentDeficit.toFixed(1)} appointments
            </p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Adjusted Weekly Target</span>
              <span className="text-2xl font-bold text-primary">{adjustedWeeklyTarget.toFixed(1)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Need {adjustedWeeklyTarget.toFixed(1)} appointments/week for remaining {remainingWeeks} weeks
            </p>
          </div>
        </div>

        {/* Budget Allocation */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="font-semibold text-sm text-muted-foreground">Yearly Budget Allocation</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-medium">Targeted Leads (Yearly)</span>
              </div>
              <p className="text-2xl font-bold">{targetedLeadsYearly.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">${yearlyBudgetForLeads.toFixed(2)} allocated</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span className="font-medium">Mailboxes</span>
              </div>
              <p className="text-2xl font-bold">{mailboxes}</p>
              <p className="text-xs text-muted-foreground">${yearlyBudgetForMailboxes.toFixed(2)} allocated</p>
            </div>
          </div>
        </div>

        {/* Current Performance */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="font-semibold text-sm text-muted-foreground">Current Pace (Weekly Avg)</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Outreach</p>
              <p className="text-lg font-bold">{Math.round(currentPace?.weeklyOutreachVolume || 0)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Response Rate</p>
              <p className="text-lg font-bold">{(currentPace?.responseRate || 0).toFixed(1)}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Appointments</p>
              <p className="text-lg font-bold">{(currentPace?.appointmentsPerWeek || 0).toFixed(1)}</p>
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
