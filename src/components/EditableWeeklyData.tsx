import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, Pencil } from 'lucide-react';
import { useWeeklyData } from '@/hooks/useWeeklyData';

interface WeeklyDataRow {
  id?: string;
  week_number: number;
  leads_contacted: number;
}

interface EditableWeeklyDataProps {
  campaignId: string;
  campaignName: string;
  weeklyData: WeeklyDataRow[];
}

export function EditableWeeklyData({ campaignId, campaignName, weeklyData }: EditableWeeklyDataProps) {
  const [editingWeek, setEditingWeek] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const { upsertWeeklyData } = useWeeklyData(campaignId);

  const handleSave = async (weekNumber: number) => {
    await upsertWeeklyData.mutateAsync({
      week_number: weekNumber,
      leads_contacted: parseInt(editValue),
    });
    setEditingWeek(null);
    setEditValue('');
  };

  const startEdit = (week: WeeklyDataRow) => {
    setEditingWeek(week.week_number);
    setEditValue(week.leads_contacted.toString());
  };

  // Show at least 4 weeks
  const weeks = Array.from({ length: Math.max(4, weeklyData.length) }, (_, i) => {
    const existing = weeklyData.find(w => w.week_number === i + 1);
    return existing || { week_number: i + 1, leads_contacted: 0 };
  });

  return (
    <Card className="shadow-primary-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Weekly Data - {campaignName}</span>
          <span className="text-sm text-muted-foreground font-normal">
            Click to edit • Changes saved automatically
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Week</TableHead>
              <TableHead className="text-right">Leads Contacted</TableHead>
              <TableHead className="text-right">Daily Average</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weeks.map((week) => {
              const dailyAverage = (week.leads_contacted / 5).toFixed(1);
              const isEditing = editingWeek === week.week_number;

              return (
                <TableRow key={week.week_number}>
                  <TableCell className="font-medium">Week {week.week_number}</TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input
                        type="number"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 h-8 text-right"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSave(week.week_number);
                          if (e.key === 'Escape') setEditingWeek(null);
                        }}
                      />
                    ) : (
                      week.leads_contacted
                    )}
                  </TableCell>
                  <TableCell className="text-right">{dailyAverage}</TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Button
                        size="sm"
                        onClick={() => handleSave(week.week_number)}
                        disabled={upsertWeeklyData.isPending}
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(week)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
