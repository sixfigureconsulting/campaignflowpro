import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, CheckCircle2, Clock } from "lucide-react";

interface Recommendation {
  id: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
  action: string;
  expectedImpact: string;
}

interface ActionableInsightsProps {
  recommendations: Recommendation[];
}

export const ActionableInsights = ({ recommendations }: ActionableInsightsProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="shadow-primary-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Actionable Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => (
          <div key={rec.id} className="p-4 rounded-lg border bg-card hover:shadow-primary-sm transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <Badge className={getPriorityColor(rec.priority)}>
                {rec.priority.toUpperCase()} PRIORITY
              </Badge>
              <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">
                {rec.category}
              </span>
            </div>
            
            <p className="text-sm font-medium mb-2">{rec.action}</p>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Expected: {rec.expectedImpact}</span>
              </div>
              <Button size="sm" variant="outline" className="h-7">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Mark Done
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
