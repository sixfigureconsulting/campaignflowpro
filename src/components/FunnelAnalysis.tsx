import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, Users, Calendar } from "lucide-react";

interface FunnelStage {
  stage: string;
  prospects: number;
  conversionRate: number;
  status: 'good' | 'warning' | 'critical';
  issue: string | null;
}

interface FunnelAnalysisProps {
  data: {
    tofu: FunnelStage;
    mofu: FunnelStage;
    bofu: FunnelStage;
  };
}

export const FunnelAnalysis = ({ data }: FunnelAnalysisProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-success/10 text-success border-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStageIcon = (stage: string) => {
    if (stage.includes('TOFU')) return <Users className="w-5 h-5" />;
    if (stage.includes('MOFU')) return <TrendingUp className="w-5 h-5" />;
    if (stage.includes('BOFU')) return <Calendar className="w-5 h-5" />;
    return null;
  };

  const stages = [
    { key: 'tofu', data: data.tofu },
    { key: 'mofu', data: data.mofu },
    { key: 'bofu', data: data.bofu },
  ];

  return (
    <Card className="shadow-primary-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          Sales Funnel Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stages.map(({ key, data: stage }) => (
          <div key={key} className="p-4 rounded-lg border bg-card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStageIcon(stage.stage)}
                <div>
                  <h4 className="font-semibold">{stage.stage}</h4>
                  <p className="text-sm text-muted-foreground">
                    {stage.prospects.toLocaleString()} prospects
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(stage.status)}>
                {stage.status.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">Conversion Rate</span>
              <span className="font-semibold">{stage.conversionRate}%</span>
            </div>
            
            {stage.issue && (
              <div className="mt-3 p-3 rounded-md bg-warning/5 border border-warning/20">
                <p className="text-sm text-warning flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{stage.issue}</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
