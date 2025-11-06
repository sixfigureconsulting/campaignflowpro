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
  target_outreach?: number;
}

interface EditableWeeklyDataProps {
  campaignId: string;
  campaignName: string;
  weeklyData: WeeklyDataRow[];
}

export function EditableWeeklyData({ campaignId, campaignName, weeklyData }: EditableWeeklyDataProps) {
  const [editingWeek, setEditingWeek] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<'leads' | 'outreach' | null>(null);
  const [editValue, setEditValue] = useState('');
  const { upsertWeeklyData } = useWeeklyData(campaignId);

  const handleSave = async (weekNumber: number, field: 'leads' | 'outreach') => {
    const existingWeek = weeklyData.find(w => w.week_number === weekNumber);
    await upsertWeeklyData.mutateAsync({
      week_number: weekNumber,
      leads_contacted: field === 'leads' ? parseInt(editValue) : (existingWeek?.leads_contacted || 0),
      target_outreach: field === 'outreach' ? parseInt(editValue) : (existingWeek?.target_outreach || 0),
    });
    setEditingWeek(null);
    setEditingField(null);
    setEditValue('');
  };

  const startEdit = (week: WeeklyDataRow, field: 'leads' | 'outreach') => {
    setEditingWeek(week.week_number);
    setEditingField(field);
    setEditValue(field === 'leads' ? week.leads_contacted.toString() : (week.target_outreach || 0).toString());
  };

  // Show at least 4 weeks
  const weeks = Array.from({ length: Math.max(4, weeklyData.length) }, (_, i) => {
    const existing = weeklyData.find(w => w.week_number === i + 1);
    return existing || { week_number: i + 1, leads_contacted: 0, target_outreach: 0 };
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
              <TableHead className="text-right">Target Outreach</TableHead>
              <TableHead className="text-right">Daily Average</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weeks.map((week) => {
              const dailyAverage = (week.leads_contacted / 5).toFixed(1);
              const isEditingLeads = editingWeek === week.week_number && editingField === 'leads';
              const isEditingOutreach = editingWeek === week.week_number && editingField === 'outreach';

              return (
                <TableRow key={week.week_number}>
                  <TableCell className="font-medium">Week {week.week_number}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isEditingLeads ? (
                        <>
                          <Input
                            type="number"
                            min="0"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 h-7 text-right text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(week.week_number, 'leads');
                              if (e.key === 'Escape') { setEditingWeek(null); setEditingField(null); }
                            }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2"
                            onClick={() => handleSave(week.week_number, 'leads')}
                            disabled={upsertWeeklyData.isPending}
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span>{week.leads_contacted}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => startEdit(week, 'leads')}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isEditingOutreach ? (
                        <>
                          <Input
                            type="number"
                            min="0"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 h-7 text-right text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(week.week_number, 'outreach');
                              if (e.key === 'Escape') { setEditingWeek(null); setEditingField(null); }
                            }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2"
                            onClick={() => handleSave(week.week_number, 'outreach')}
                            disabled={upsertWeeklyData.isPending}
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span>{week.target_outreach || 0}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => startEdit(week, 'outreach')}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{dailyAverage}</TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">Inline edit</span>
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
