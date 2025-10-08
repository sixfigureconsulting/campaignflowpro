import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface WeekTab {
  id: string;
  weekNumber: number;
}

interface WeeklyTabsProps {
  tabs: WeekTab[];
  activeWeek: string;
  onWeekChange: (weekId: string) => void;
  onAddWeek: () => void;
  children: (weekId: string) => React.ReactNode;
}

export const WeeklyTabs = ({ 
  tabs, 
  activeWeek, 
  onWeekChange, 
  onAddWeek,
  children 
}: WeeklyTabsProps) => {
  return (
    <Tabs value={activeWeek} onValueChange={onWeekChange} className="w-full">
      <div className="flex items-center gap-2">
        <TabsList className="flex-1 justify-start h-auto p-1 bg-muted/50">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id}
              value={tab.id} 
              className="data-[state=active]:bg-background"
            >
              Week {tab.weekNumber}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddWeek}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Week
        </Button>
      </div>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          {children(tab.id)}
        </TabsContent>
      ))}
    </Tabs>
  );
};
