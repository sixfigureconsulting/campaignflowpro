import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface WeeklyData {
  week: string;
  leads: number;
}

interface WeeklyVolumeTableProps {
  data: WeeklyData[];
}

export const WeeklyVolumeTable = ({ data }: WeeklyVolumeTableProps) => {
  return (
    <Card className="shadow-primary-md">
      <CardHeader>
        <CardTitle>Weekly Volume Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Week</TableHead>
              <TableHead className="text-right">Leads Contacted</TableHead>
              <TableHead className="text-right">Est Daily Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((week) => {
              const dailyVolume = (week.leads / 5).toFixed(1);
              return (
                <TableRow key={week.week}>
                  <TableCell className="font-medium">{week.week}</TableCell>
                  <TableCell className="text-right">{week.leads}</TableCell>
                  <TableCell className="text-right">{dailyVolume}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
