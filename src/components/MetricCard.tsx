import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const MetricCard = ({ title, value, change, subtitle, icon }: MetricCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <Card className="shadow-primary-md hover:shadow-primary-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 mt-2">
          <span className={`inline-flex items-center text-xs font-medium ${
            isPositive ? 'text-success' : 'text-destructive'
          }`}>
            {isPositive ? (
              <ArrowUp className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDown className="w-3 h-3 mr-1" />
            )}
            {Math.abs(change)}%
          </span>
          {subtitle && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
