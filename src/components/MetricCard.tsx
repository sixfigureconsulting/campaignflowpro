import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  accentColor?: "primary" | "success" | "warning" | "destructive";
  showProgress?: boolean;
  progressValue?: number;
  progressMax?: number;
}

const accentStyles = {
  primary: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    progressBar: "bg-primary",
  },
  success: {
    iconBg: "bg-success/10",
    iconColor: "text-success",
    progressBar: "bg-success",
  },
  warning: {
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    progressBar: "bg-warning",
  },
  destructive: {
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    progressBar: "bg-destructive",
  },
};

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  subtitle, 
  icon,
  trend,
  accentColor = "primary",
  showProgress = false,
  progressValue = 0,
  progressMax = 100,
}: MetricCardProps) => {
  const styles = accentStyles[accentColor];
  const isPositive = change !== undefined ? change >= 0 : trend === "up";
  const isNeutral = change === 0 || trend === "neutral";
  const progressPercent = progressMax > 0 ? Math.min((progressValue / progressMax) * 100, 100) : 0;
  
  return (
    <Card className="stat-card group">
      {/* Decorative gradient accent */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
        <div className={cn("w-full h-full rounded-full blur-2xl", styles.iconBg)} />
      </div>
      
      <CardContent className="p-0 relative">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl transition-transform duration-300 group-hover:scale-110",
            styles.iconBg
          )}>
            <div className={styles.iconColor}>
              {icon}
            </div>
          </div>
          
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
              isNeutral 
                ? "bg-muted text-muted-foreground"
                : isPositive 
                  ? "bg-success/10 text-success" 
                  : "bg-destructive/10 text-destructive"
            )}>
              {isNeutral ? (
                <Minus className="w-3 h-3" />
              ) : isPositive ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>

        {showProgress && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className={cn("progress-bar-fill", styles.progressBar)}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
