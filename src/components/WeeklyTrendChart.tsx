import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface WeeklyData {
  week: string;
  leads: number;
  responses: number;
  appointments: number;
}

interface WeeklyTrendChartProps {
  data: WeeklyData[];
  campaignName?: string;
  goalAppointments?: number;
}

export const WeeklyTrendChart = ({ data, campaignName, goalAppointments }: WeeklyTrendChartProps) => {
  // Calculate weekly goal (distribute monthly goal across weeks)
  const weeklyGoal = goalAppointments ? goalAppointments / 4 : undefined;

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
            {weeklyGoal && (
              <ReferenceLine 
                y={weeklyGoal} 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
                strokeWidth={2}
                label={{ value: 'Goal', position: 'right', fill: '#ef4444', fontSize: 12 }}
              />
            )}
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
