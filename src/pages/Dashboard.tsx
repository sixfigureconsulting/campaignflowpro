import { useState, useMemo, useEffect } from "react";
import { MetricCard } from "@/components/MetricCard";
import { EditableMetricCard } from "@/components/EditableMetricCard";
import { ActionableInsights } from "@/components/ActionableInsights";
import { PredictiveBudgetAnalytics } from "@/components/PredictiveBudgetAnalytics";
import { WeeklyTrendChart } from "@/components/WeeklyTrendChart";
import { WeeklyVolumeTable } from "@/components/WeeklyVolumeTable";
import { GoalsSection } from "@/components/GoalsSection";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { BudgetAllocation } from "@/components/BudgetAllocation";
import { InfrastructureSection } from "@/components/InfrastructureSection";
import { CampaignTabs, CampaignTab } from "@/components/CampaignTabs";
import { WeeklyTabs, WeekTab } from "@/components/WeeklyTabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Users, Calendar, TrendingUp, Target, Plus, Settings, MessageSquare, FolderPlus, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Sample data - in production, this would come from API/database
const campaignData = [
  {
    id: 1,
    name: "SaaS Founders Outreach",
    channel: "Email",
    leadsContacted: 1247,
    responseRate: 4.2,
    appointmentsBooked: 23,
    status: "Active",
    weeklyData: [
      { week: "Week 1", leads: 180, responses: 8, appointments: 3 },
      { week: "Week 2", leads: 220, responses: 12, appointments: 5 },
      { week: "Week 3", leads: 195, responses: 7, appointments: 4 },
      { week: "Week 4", leads: 210, responses: 15, appointments: 6 },
      { week: "Week 5", leads: 225, responses: 9, appointments: 3 },
      { week: "Week 6", leads: 217, responses: 11, appointments: 2 },
    ],
  },
  {
    id: 2,
    name: "E-commerce CMOs",
    channel: "LinkedIn",
    leadsContacted: 892,
    responseRate: 6.8,
    appointmentsBooked: 31,
    status: "Active",
    weeklyData: [
      { week: "Week 1", leads: 120, responses: 9, appointments: 4 },
      { week: "Week 2", leads: 145, responses: 11, appointments: 6 },
      { week: "Week 3", leads: 135, responses: 8, appointments: 5 },
      { week: "Week 4", leads: 160, responses: 13, appointments: 7 },
      { week: "Week 5", leads: 142, responses: 10, appointments: 5 },
      { week: "Week 6", leads: 190, responses: 9, appointments: 4 },
    ],
  },
];

const predictiveData = {
  currentPace: {
    appointmentsPerWeek: 15.5,
    responseRate: 4.9,
  },
  projectedOutcome: {
    monthlyAppointments: 62,
    confidence: 87,
  },
  budgetRecommendations: {
    additionalLeads: {
      cost: 500,
      expectedAppointments: 18,
    },
    additionalMailboxes: {
      cost: 300,
      expectedAppointments: 12,
    },
  },
};

const Index = () => {
  const { signOut } = useAuth();
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [brandColor, setBrandColor] = useState("#4F46E5");
  const [logo, setLogo] = useState("");
  const [clientName, setClientName] = useState("CampaignFlow Pro");
  
  // Apply brand color to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const hex = brandColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Convert RGB to HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
        case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
        case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
      }
    }
    
    const hslH = Math.round(h * 360);
    const hslS = Math.round(s * 100);
    const hslL = Math.round(l * 100);
    
    root.style.setProperty('--primary', `${hslH} ${hslS}% ${hslL}%`);
    root.style.setProperty('--chart-1', `${hslH} ${hslS}% ${hslL}%`);
  }, [brandColor]);
  
  // Campaign tabs state
  const [campaignTabs, setCampaignTabs] = useState<CampaignTab[]>([
    { id: "campaign-1", name: "Campaign 1" }
  ]);
  const [activeTab, setActiveTab] = useState("campaign-1");
  
  // Weekly tabs state per campaign
  const [weeklyTabs, setWeeklyTabs] = useState<Record<string, WeekTab[]>>({
    "campaign-1": [{ id: "week-1", weekNumber: 1 }]
  });
  const [activeWeek, setActiveWeek] = useState<Record<string, string>>({
    "campaign-1": "week-1"
  });
  
  // Weekly data per campaign per week
  const [weeklyData, setWeeklyData] = useState<Record<string, Record<string, {
    leads: number;
    appointments: number;
    replies: number;
  }>>>({
    "campaign-1": {
      "week-1": { leads: 0, appointments: 0, replies: 0 }
    }
  });
  
  // State per campaign (keyed by tab id)
  const [campaignData, setCampaignData] = useState<Record<string, {
    goals: { targetAppointments: number; targetResponseRate: number; targetVolume: number; allocatedBudget: number };
    infrastructure: { totalMailboxes: number; totalLinkedInAccounts: number };
  }>>({
    "campaign-1": {
      goals: { targetAppointments: 270, targetResponseRate: 5, targetVolume: 60000, allocatedBudget: 5200 },
      infrastructure: { totalMailboxes: 5, totalLinkedInAccounts: 2 }
    }
  });

  // Get current campaign data
  const currentData = campaignData[activeTab] || {
    goals: { targetAppointments: 270, targetResponseRate: 5, targetVolume: 60000, allocatedBudget: 5200 },
    infrastructure: { totalMailboxes: 5, totalLinkedInAccounts: 2 }
  };
  
  const { goals, infrastructure } = currentData;
  
  // Get current week for active campaign
  const currentWeekId = activeWeek[activeTab] || "";
  const currentWeekData = weeklyData[activeTab]?.[currentWeekId] || { leads: 0, appointments: 0, replies: 0 };
  
  // Calculate totals across all weeks for current campaign
  const totalLeads = useMemo(() => {
    const weeks = weeklyData[activeTab] || {};
    return Object.values(weeks).reduce((sum, week) => sum + week.leads, 0);
  }, [weeklyData, activeTab]);
  
  const totalAppointments = useMemo(() => {
    const weeks = weeklyData[activeTab] || {};
    return Object.values(weeks).reduce((sum, week) => sum + week.appointments, 0);
  }, [weeklyData, activeTab]);
  
  const totalReplies = useMemo(() => {
    const weeks = weeklyData[activeTab] || {};
    return Object.values(weeks).reduce((sum, week) => sum + week.replies, 0);
  }, [weeklyData, activeTab]);
  
  // Update campaign data helpers
  const updateCampaignData = (updates: Partial<typeof currentData>) => {
    setCampaignData(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], ...updates }
    }));
  };
  
  // Update weekly data
  const updateWeeklyData = (weekId: string, updates: Partial<typeof currentWeekData>) => {
    setWeeklyData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [weekId]: { ...prev[activeTab]?.[weekId], ...updates }
      }
    }));
  };

  // Update CSS custom property for dynamic brand color
  useEffect(() => {
    document.documentElement.style.setProperty('--brand-color', brandColor);
  }, [brandColor]);

  // Auto-calculate rates
  const responseRate = useMemo(() => {
    return totalLeads > 0 ? ((totalReplies / totalLeads) * 100).toFixed(1) : "0.0";
  }, [totalLeads, totalReplies]);

  const conversionRate = useMemo(() => {
    return totalReplies > 0 ? ((totalAppointments / totalReplies) * 100).toFixed(1) : "0.0";
  }, [totalAppointments, totalReplies]);

  // Generate dynamic recommendations based on goals
  const recommendations = useMemo(() => {
    const recs = [];
    const currentResponseRate = parseFloat(responseRate);
    const appointmentGap = goals.targetAppointments - totalAppointments;

    if (appointmentGap > 0) {
      const currentConversionRate = totalReplies > 0 ? totalAppointments / totalReplies : 0;
      const neededReplies = Math.ceil(goals.targetAppointments / (currentConversionRate || 0.1));
      const neededLeads = Math.ceil(neededReplies / ((currentResponseRate / 100) || 0.05));
      const additionalLeads = Math.max(0, neededLeads - totalLeads);

      if (additionalLeads > 0) {
        recs.push({
          id: 1,
          priority: "high" as const,
          category: "Lead Volume",
          action: `Reach out to ${additionalLeads.toLocaleString()} additional prospects to hit ${goals.targetAppointments} appointment goal`,
          expectedImpact: `${appointmentGap} more appointments needed`,
        });

        const additionalMailboxes = Math.ceil(additionalLeads / 500);
        if (additionalMailboxes > 0) {
          recs.push({
            id: 2,
            priority: "high" as const,
            category: "Infrastructure",
            action: `Purchase ${additionalMailboxes} additional mailbox${additionalMailboxes > 1 ? 'es' : ''} to increase outreach capacity`,
            expectedImpact: `Support ${additionalLeads.toLocaleString()} more leads`,
          });
        }

        recs.push({
          id: 3,
          priority: "high" as const,
          category: "Lead Sourcing",
          action: "Source and validate new lead lists matching ICP criteria",
          expectedImpact: `Build pipeline for ${additionalLeads.toLocaleString()} leads`,
        });
      }
    }

    if (currentResponseRate < goals.targetResponseRate) {
      recs.push({
        id: 4,
        priority: "medium" as const,
        category: "Messaging",
        action: "A/B test new subject lines and opening hooks to improve response rate",
        expectedImpact: `Target: ${goals.targetResponseRate}% (Current: ${responseRate}%)`,
      });

      recs.push({
        id: 5,
        priority: "medium" as const,
        category: "Follow-up",
        action: "Implement 3-touch follow-up sequence for non-responders",
        expectedImpact: "+2-3% response rate boost",
      });
    }

    if (parseFloat(conversionRate) < 15) {
      recs.push({
        id: 6,
        priority: "medium" as const,
        category: "Conversion",
        action: "Optimize appointment booking process and value proposition",
        expectedImpact: "Improve reply-to-appointment conversion",
      });
    }

    return recs.length > 0 ? recs : [{
      id: 1,
      priority: "low" as const,
      category: "Performance",
      action: "Continue current strategy - metrics are on track",
      expectedImpact: "Maintain momentum",
    }];
  }, [totalLeads, totalAppointments, totalReplies, responseRate, conversionRate, goals]);

  const weeksCompleted = useMemo(() => {
    return (weeklyTabs[activeTab] || []).length;
  }, [weeklyTabs, activeTab]);

  // Calculate average daily volume across all weeks
  const avgDailyVolume = useMemo(() => {
    const weeks = weeklyTabs[activeTab] || [];
    const data = weeklyData[activeTab] || {};
    const totalDailyVolumes = weeks.reduce((sum, week) => {
      const weekData = data[week.id] || { leads: 0 };
      return sum + (weekData.leads / 5);
    }, 0);
    return weeks.length > 0 ? totalDailyVolumes / weeks.length : 0;
  }, [weeklyTabs, weeklyData, activeTab]);

  const predictiveData = {
    currentPace: {
      appointmentsPerWeek: weeksCompleted > 0 ? totalAppointments / weeksCompleted : 0,
      responseRate: parseFloat(responseRate),
      weeklyOutreachVolume: weeksCompleted > 0 ? Math.round(totalLeads / weeksCompleted) : 0,
      avgDailyVolume,
    },
  };
  
  // Handle new campaign creation
  const handleNewCampaign = () => {
    const newId = `campaign-${Date.now()}`;
    const newTab: CampaignTab = {
      id: newId,
      name: `Campaign ${campaignTabs.length + 1}`
    };
    setCampaignTabs([...campaignTabs, newTab]);
    setCampaignData(prev => ({
      ...prev,
      [newId]: {
        goals: { targetAppointments: 270, targetResponseRate: 5, targetVolume: 60000, allocatedBudget: 5200 },
        infrastructure: { totalMailboxes: 5, totalLinkedInAccounts: 2 }
      }
    }));
    setWeeklyTabs(prev => ({
      ...prev,
      [newId]: [{ id: "week-1", weekNumber: 1 }]
    }));
    setActiveWeek(prev => ({
      ...prev,
      [newId]: "week-1"
    }));
    setWeeklyData(prev => ({
      ...prev,
      [newId]: {
        "week-1": { leads: 0, appointments: 0, replies: 0 }
      }
    }));
    setActiveTab(newId);
  };
  
  // Handle tab close
  const handleTabClose = (tabId: string) => {
    const newTabs = campaignTabs.filter(tab => tab.id !== tabId);
    setCampaignTabs(newTabs);
    
    // Remove campaign data
    const newData = { ...campaignData };
    delete newData[tabId];
    setCampaignData(newData);
    
    // Remove weekly data
    const newWeeklyData = { ...weeklyData };
    delete newWeeklyData[tabId];
    setWeeklyData(newWeeklyData);
    
    const newWeeklyTabs = { ...weeklyTabs };
    delete newWeeklyTabs[tabId];
    setWeeklyTabs(newWeeklyTabs);
    
    const newActiveWeek = { ...activeWeek };
    delete newActiveWeek[tabId];
    setActiveWeek(newActiveWeek);
    
    // Switch to another tab if closing active tab
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[0].id);
    }
  };

  // Handle tab rename
  const handleTabRename = (tabId: string, newName: string) => {
    setCampaignTabs(tabs => 
      tabs.map(tab => tab.id === tabId ? { ...tab, name: newName } : tab)
    );
  };
  
  // Handle adding new week
  const handleAddWeek = () => {
    const currentWeeks = weeklyTabs[activeTab] || [];
    const newWeekNumber = currentWeeks.length + 1;
    const newWeekId = `week-${Date.now()}`;
    const newWeek: WeekTab = {
      id: newWeekId,
      weekNumber: newWeekNumber
    };
    
    setWeeklyTabs(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newWeek]
    }));
    
    setWeeklyData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [newWeekId]: { leads: 0, appointments: 0, replies: 0 }
      }
    }));
    
    setActiveWeek(prev => ({
      ...prev,
      [activeTab]: newWeekId
    }));
  };

  // Generate cumulative graph data across all weeks
  const displayData = useMemo(() => {
    const weeks = weeklyTabs[activeTab] || [];
    const data = weeklyData[activeTab] || {};
    
    return weeks.map(week => {
      const weekData = data[week.id] || { leads: 0, replies: 0, appointments: 0 };
      return {
        week: `Week ${week.weekNumber}`,
        leads: weekData.leads,
        responses: weekData.replies,
        appointments: weekData.appointments,
      };
    });
  }, [weeklyTabs, weeklyData, activeTab]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-primary-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="cursor-pointer group relative">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setLogo(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {logo ? (
                  <img src={logo} alt="Company Logo" className="h-12 w-auto rounded group-hover:opacity-80 transition-opacity" />
                ) : (
                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30 group-hover:border-primary group-hover:bg-primary/5 transition-colors">
                    <span className="text-xs text-muted-foreground">Logo</span>
                  </div>
                )}
              </label>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {clientName}
                </h1>
                <p className="text-sm text-muted-foreground">B2B Cold Outreach Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleNewCampaign}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://lovable.dev', '_blank')}
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                New Project
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <CustomizationPanel
                    currentColor={brandColor}
                    currentClientName={clientName}
                    currentLogo={logo}
                    onColorChange={setBrandColor}
                    onLogoChange={setLogo}
                    onClientNameChange={setClientName}
                  />
                </PopoverContent>
              </Popover>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={signOut}
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        <CampaignTabs
          tabs={campaignTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onTabClose={handleTabClose}
          onTabRename={handleTabRename}
        >
          {(tabId) => (
            <div className="space-y-8">
              {/* Weekly Trends Chart - First */}
              <WeeklyTrendChart 
                data={displayData} 
                campaignName={campaignTabs.find(t => t.id === activeTab)?.name}
                goalAppointments={goals.targetAppointments}
              />
              
              {/* Weekly Volume Table */}
              <WeeklyVolumeTable data={displayData} />

              {/* Weekly Tabs with Inputs */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                  Weekly Data Entry
                </h2>
                <WeeklyTabs
                  tabs={weeklyTabs[activeTab] || []}
                  activeWeek={currentWeekId}
                  onWeekChange={(weekId) => setActiveWeek(prev => ({ ...prev, [activeTab]: weekId }))}
                  onAddWeek={handleAddWeek}
                >
                  {(weekId) => {
                    const weekData = weeklyData[activeTab]?.[weekId] || { leads: 0, appointments: 0, replies: 0 };
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <EditableMetricCard
                          title="Leads Contacted"
                          value={weekData.leads}
                          onChange={(val) => updateWeeklyData(weekId, { leads: val })}
                          subtitle="Click to edit"
                          icon={<Users className="w-4 h-4" />}
                        />
                        <EditableMetricCard
                          title="Replies Received"
                          value={weekData.replies}
                          onChange={(val) => updateWeeklyData(weekId, { replies: val })}
                          subtitle="Click to edit"
                          icon={<MessageSquare className="w-4 h-4" />}
                        />
                        <EditableMetricCard
                          title="Appointments Booked"
                          value={weekData.appointments}
                          onChange={(val) => updateWeeklyData(weekId, { appointments: val })}
                          subtitle="Click to edit"
                          icon={<Calendar className="w-4 h-4" />}
                        />
                      </div>
                    );
                  }}
                </WeeklyTabs>
              </div>

              {/* Current Outbound Performance */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                  Current Outbound Performance
                </h2>
                
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Leads Generated"
                  value={totalLeads}
                  change={0}
                  subtitle="across all weeks"
                  icon={<Users className="w-4 h-4" />}
                />
                <MetricCard
                  title="Total Replies Received"
                  value={totalReplies}
                  change={0}
                  subtitle="across all weeks"
                  icon={<MessageSquare className="w-4 h-4" />}
                />
                <MetricCard
                  title="Appointments Booked"
                  value={totalAppointments}
                  change={0}
                  subtitle="across all weeks"
                  icon={<Calendar className="w-4 h-4" />}
                />
                <MetricCard
                  title="Response Rate"
                  value={`${responseRate}%`}
                  change={0}
                  subtitle="auto-calculated"
                  icon={<TrendingUp className="w-4 h-4" />}
                />
                </div>
              </div>

              {/* Define Campaign Goals */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                  Define Campaign Goals
                </h2>
                <GoalsSection 
                  onGoalsUpdate={(newGoals) => updateCampaignData({ goals: newGoals })} 
                />
              </div>

              {/* Infrastructure Available */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                  Infrastructure Available
                </h2>
                <InfrastructureSection 
                  onInfrastructureUpdate={(infra) => updateCampaignData({ infrastructure: infra })}
                />
              </div>

              {/* Budget & Performance Projections */}
              <PredictiveBudgetAnalytics
                allocatedBudget={goals.allocatedBudget}
                yearlyGoals={{
                  targetAppointments: goals.targetAppointments,
                  targetLeads: goals.targetVolume,
                }}
                infrastructure={infrastructure}
                currentPerformance={{
                  totalAppointments,
                  totalLeads,
                  totalReplies,
                  weeksCompleted,
                }}
                currentPace={predictiveData.currentPace}
              />

              {/* Actionable Recommendations */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                  Actionable Recommendations
                </h2>
                <ActionableInsights recommendations={recommendations} />
              </div>
            </div>
          )}
        </CampaignTabs>
      </main>
    </div>
  );
};

export default Index;
