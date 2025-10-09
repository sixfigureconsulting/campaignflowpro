import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Target, Save } from "lucide-react";
import { useState } from "react";

interface GoalsSectionProps {
  onGoalsUpdate: (goals: { 
    targetAppointments: number; 
    targetResponseRate: number;
    targetVolume: number;
    allocatedBudget: number;
  }) => void;
}

export const GoalsSection = ({ onGoalsUpdate }: GoalsSectionProps) => {
  const [targetAppointments, setTargetAppointments] = useState(270);
  const [targetResponseRate, setTargetResponseRate] = useState(5);
  const [targetVolume, setTargetVolume] = useState(60000);
  const [allocatedBudget, setAllocatedBudget] = useState(5200);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onGoalsUpdate({ targetAppointments, targetResponseRate, targetVolume, allocatedBudget });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <Card className="shadow-primary-md border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Campaign Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="targetAppointments">Target Appointments (Yearly)</Label>
            <Input
              id="targetAppointments"
              type="number"
              value={targetAppointments}
              onChange={(e) => setTargetAppointments(parseInt(e.target.value) || 0)}
              className="text-lg font-semibold"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetResponseRate">Target Response Rate (%)</Label>
            <Input
              id="targetResponseRate"
              type="number"
              value={targetResponseRate}
              onChange={(e) => setTargetResponseRate(parseFloat(e.target.value) || 0)}
              className="text-lg font-semibold"
              step="0.1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetVolume">Target Leads Targeted (Yearly)</Label>
            <Input
              id="targetVolume"
              type="number"
              value={targetVolume}
              onChange={(e) => setTargetVolume(parseInt(e.target.value) || 0)}
              className="text-lg font-semibold"
              placeholder="Total leads to target"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="allocatedBudget">Allocated Budget (Yearly)</Label>
            <Input
              id="allocatedBudget"
              type="number"
              value={allocatedBudget}
              onChange={(e) => setAllocatedBudget(parseInt(e.target.value) || 0)}
              className="text-lg font-semibold"
              placeholder="Budget in $"
            />
          </div>
        </div>
        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {isSaved ? 'Goals Saved!' : 'Save Goals'}
        </Button>
      </CardContent>
    </Card>
  );
};
