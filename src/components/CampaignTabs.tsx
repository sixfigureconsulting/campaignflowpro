import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export interface CampaignTab {
  id: string;
  name: string;
}

interface CampaignTabsProps {
  tabs: CampaignTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabRename: (tabId: string, newName: string) => void;
  children: (tabId: string) => React.ReactNode;
}

export const CampaignTabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  onTabClose,
  onTabRename,
  children 
}: CampaignTabsProps) => {
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleStartEdit = (tab: CampaignTab) => {
    setEditingTab(tab.id);
    setEditName(tab.name);
  };

  const handleFinishEdit = (tabId: string) => {
    if (editName.trim()) {
      onTabRename(tabId, editName.trim());
    }
    setEditingTab(null);
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full justify-start h-auto p-1 bg-muted/50">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative group">
            {editingTab === tab.id ? (
              <div className="flex items-center gap-1 px-3 py-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => handleFinishEdit(tab.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFinishEdit(tab.id);
                    if (e.key === 'Escape') setEditingTab(null);
                  }}
                  className="h-6 w-32 text-sm"
                  autoFocus
                />
              </div>
            ) : (
              <>
                <TabsTrigger 
                  value={tab.id} 
                  className="data-[state=active]:bg-background pr-16"
                >
                  {tab.name}
                </TabsTrigger>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(tab);
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  {tabs.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTabClose(tab.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </>
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