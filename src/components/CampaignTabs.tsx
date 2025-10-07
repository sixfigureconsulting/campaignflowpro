import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CampaignTab {
  id: string;
  name: string;
}

interface CampaignTabsProps {
  tabs: CampaignTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  children: (tabId: string) => React.ReactNode;
}

export const CampaignTabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  onTabClose,
  children 
}: CampaignTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full justify-start h-auto p-1 bg-muted/50">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative group">
            <TabsTrigger 
              value={tab.id} 
              className="data-[state=active]:bg-background pr-8"
            >
              {tab.name}
            </TabsTrigger>
            {tabs.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          {children(tab.id)}
        </TabsContent>
      ))}
    </Tabs>
  );
};