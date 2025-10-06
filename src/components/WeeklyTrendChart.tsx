import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeeklyData {
  week: string;
  leads: number;
  responses: number;
  appointments: number;
}

interface WeeklyTrendChartProps {
  data: WeeklyData[];
  campaignName?: string;
}

export const WeeklyTrendChart = ({ data, campaignName }: WeeklyTrendChartProps) => {
  return (
    <Card className="shadow-primary-md">
      <CardHeader>
        <CardTitle>
          {campaignName ? `${campaignName} - Weekly Trends` : 'Campaign Performance Trends'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="week" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="leads" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              name="Leads Contacted"
            />
            <Line 
              type="monotone" 
              dataKey="responses" 
              stroke="hsl(var(--chart-3))" 
              strokeWidth={2}
              name="Responses"
            />
            <Line 
              type="monotone" 
              dataKey="appointments" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              name="Appointments"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
