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
  goalAppointments?: number;
}

export const WeeklyTrendChart = ({ data, campaignName, goalAppointments }: WeeklyTrendChartProps) => {
  // Calculate cumulative data
  const cumulativeData = data.map((item, index) => {
    const previousData = data.slice(0, index + 1);
    const weekNumber = index + 1;
    const cumulativeTarget = goalAppointments ? (goalAppointments / 52) * weekNumber : 0;
    
    return {
      week: item.week,
      leads: previousData.reduce((sum, d) => sum + d.leads, 0),
      responses: previousData.reduce((sum, d) => sum + d.responses, 0),
      appointments: previousData.reduce((sum, d) => sum + d.appointments, 0),
      target: cumulativeTarget,
    };
  });

  return (
    <Card className="shadow-primary-md">
      <CardHeader>
        <CardTitle>
          {campaignName ? `${campaignName} - Cumulative Weekly Trends` : 'Campaign Performance Trends (Cumulative)'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cumulativeData}>
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
              formatter={(value: number) => {
                return typeof value === 'number' ? value.toFixed(1) : value;
              }}
            />
            <Legend />
            {goalAppointments && (
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Target (Cumulative)"
                dot={false}
              />
            )}
            <Line
              type="monotone" 
              dataKey="leads" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              name="Leads Contacted"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="responses" 
              stroke="hsl(var(--chart-3))" 
              strokeWidth={2}
              name="Responses"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="appointments" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              name="Appointments"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
