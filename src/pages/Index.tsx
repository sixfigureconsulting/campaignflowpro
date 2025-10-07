import { useState, useMemo, useEffect } from "react";
import { MetricCard } from "@/components/MetricCard";
import { EditableMetricCard } from "@/components/EditableMetricCard";
import { ActionableInsights } from "@/components/ActionableInsights";
import { PredictiveAnalytics } from "@/components/PredictiveAnalytics";
import { WeeklyTrendChart } from "@/components/WeeklyTrendChart";
import { GoalsSection } from "@/components/GoalsSection";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { BudgetAllocation } from "@/components/BudgetAllocation";
import { InfrastructureSection } from "@/components/InfrastructureSection";
import { CampaignTabs, CampaignTab } from "@/components/CampaignTabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Users, Calendar, TrendingUp, Target, Plus, Settings, MessageSquare, FolderPlus } from "lucide-react";

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
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [brandColor, setBrandColor] = useState("#4F46E5");
  const [logo, setLogo] = useState("");
  
  // Campaign tabs state
  const [campaignTabs, setCampaignTabs] = useState<CampaignTab[]>([
    { id: "campaign-1", name: "Campaign 1" }
  ]);
  const [activeTab, setActiveTab] = useState("campaign-1");
  
  // State per campaign (keyed by tab id)
  const [campaignData, setCampaignData] = useState<Record<string, {
    totalLeads: number;
    totalAppointments: number;
    totalReplies: number;
    goals: { targetAppointments: number; targetResponseRate: number; targetVolume: number; allocatedBudget: number };
    infrastructure: { totalMailboxes: number; totalLinkedInAccounts: number };
  }>>({
    "campaign-1": {
      totalLeads: 2795,
      totalAppointments: 62,
      totalReplies: 137,
      goals: { targetAppointments: 10, targetResponseRate: 5, targetVolume: 5000, allocatedBudget: 100 },
      infrastructure: { totalMailboxes: 5, totalLinkedInAccounts: 2 }
    }
  });

  // Get current campaign data
  const currentData = campaignData[activeTab] || {
    totalLeads: 0,
    totalAppointments: 0,
    totalReplies: 0,
    goals: { targetAppointments: 10, targetResponseRate: 5, targetVolume: 5000, allocatedBudget: 100 },
    infrastructure: { totalMailboxes: 5, totalLinkedInAccounts: 2 }
  };
  
  const { totalLeads, totalAppointments, totalReplies, goals, infrastructure } = currentData;
  
  // Update campaign data helpers
  const updateCampaignData = (updates: Partial<typeof currentData>) => {
    setCampaignData(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], ...updates }
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

  const predictiveData = {
    currentPace: {
      appointmentsPerWeek: totalAppointments / 4,
      responseRate: parseFloat(responseRate),
      weeklyOutreachVolume: Math.round(totalLeads / 4),
    },
    projectedOutcome: {
      monthlyAppointments: totalAppointments,
      confidence: 87,
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
        totalLeads: 0,
        totalAppointments: 0,
        totalReplies: 0,
        goals: { targetAppointments: 10, targetResponseRate: 5, targetVolume: 5000, allocatedBudget: 100 },
        infrastructure: { totalMailboxes: 5, totalLinkedInAccounts: 2 }
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
    
    // Switch to another tab if closing active tab
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[0].id);
    }
  };

  // Generate realistic weekly data that sums to actual totals
  const displayData = useMemo(() => {
    const numWeeks = 6;
    const weeklyData = [];
    
    // Distribute totals across weeks with some variation
    for (let i = 0; i < numWeeks; i++) {
      const weekFactor = 0.8 + Math.random() * 0.4; // Random between 0.8 and 1.2
      weeklyData.push({
        week: `Week ${i + 1}`,
        leads: Math.round((totalLeads / numWeeks) * weekFactor),
        responses: Math.round((totalReplies / numWeeks) * weekFactor),
        appointments: Math.round((totalAppointments / numWeeks) * weekFactor),
      });
    }
    
    // Adjust last week to ensure totals match exactly
    const leadsSum = weeklyData.reduce((sum, w) => sum + w.leads, 0);
    const responsesSum = weeklyData.reduce((sum, w) => sum + w.responses, 0);
    const appointmentsSum = weeklyData.reduce((sum, w) => sum + w.appointments, 0);
    
    weeklyData[numWeeks - 1].leads += totalLeads - leadsSum;
    weeklyData[numWeeks - 1].responses += totalReplies - responsesSum;
    weeklyData[numWeeks - 1].appointments += totalAppointments - appointmentsSum;
    
    return { weeklyData };
  }, [totalLeads, totalReplies, totalAppointments]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-primary-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {logo && (
                <img src={logo} alt="Company Logo" className="h-10 w-auto rounded" />
              )}
              <div>
                <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                  CampaignFlow Pro
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
                    onColorChange={setBrandColor}
                    onLogoChange={setLogo}
                  />
                </PopoverContent>
              </Popover>
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
        >
          {(tabId) => (
            <div className="space-y-8">
              {/* Goals Section */}
              <GoalsSection 
                onGoalsUpdate={(newGoals) => updateCampaignData({ goals: newGoals })} 
              />

              {/* Budget Allocation */}
              <BudgetAllocation allocatedBudget={goals.allocatedBudget} />

              {/* Infrastructure Section */}
              <InfrastructureSection 
                onInfrastructureUpdate={(infra) => updateCampaignData({ infrastructure: infra })}
              />

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <EditableMetricCard
                  title="Total Leads Generated"
                  value={totalLeads}
                  onChange={(val) => updateCampaignData({ totalLeads: val })}
                  subtitle="Click to edit"
                  icon={<Users className="w-4 h-4" />}
                />
                <EditableMetricCard
                  title="Total Replies Received"
                  value={totalReplies}
                  onChange={(val) => updateCampaignData({ totalReplies: val })}
                  subtitle="Click to edit"
                  icon={<MessageSquare className="w-4 h-4" />}
                />
                <EditableMetricCard
                  title="Appointments Booked"
                  value={totalAppointments}
                  onChange={(val) => updateCampaignData({ totalAppointments: val })}
                  subtitle="Click to edit"
                  icon={<Calendar className="w-4 h-4" />}
                />
                <MetricCard
                  title="Response Rate"
                  value={`${responseRate}%`}
                  change={0}
                  subtitle="auto-calculated"
                  icon={<TrendingUp className="w-4 h-4" />}
                />
                <MetricCard
                  title="Conversion Rate"
                  value={`${conversionRate}%`}
                  change={0}
                  subtitle="reply to appointment"
                  icon={<Target className="w-4 h-4" />}
                />
              </div>

              {/* Weekly Trends Chart */}
              <WeeklyTrendChart 
                data={displayData.weeklyData} 
                campaignName={campaignTabs.find(t => t.id === activeTab)?.name}
                goalAppointments={goals.targetAppointments}
              />

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <ActionableInsights recommendations={recommendations} />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <PredictiveAnalytics
                    currentPace={predictiveData.currentPace}
                    projectedOutcome={predictiveData.projectedOutcome}
                  />
                </div>
              </div>
            </div>
          )}
        </CampaignTabs>
      </main>
    </div>
  );
};

export default Index;
