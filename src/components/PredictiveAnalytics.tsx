import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Mail, Users } from "lucide-react";

interface PredictiveAnalyticsProps {
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

export const PredictiveAnalytics = ({ 
  currentPace, 
  projectedOutcome
}: PredictiveAnalyticsProps) => {
  return (
    <Card className="shadow-primary-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Predictive Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Performance */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Current Pace</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Weekly Appointments</p>
              <p className="text-xl font-bold">{currentPace.appointmentsPerWeek.toFixed(1)}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Response Rate</p>
              <p className="text-xl font-bold">{currentPace.responseRate}%</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Weekly Outreach</p>
              <p className="text-xl font-bold">{currentPace.weeklyOutreachVolume.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Projected Outcome */}
        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">30-Day Projection</h4>
            <span className="text-xs text-muted-foreground">
              {projectedOutcome.confidence}% confidence
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              {projectedOutcome.monthlyAppointments}
            </span>
            <span className="text-sm text-muted-foreground">appointments</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
