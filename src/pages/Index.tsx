import { useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { FunnelAnalysis } from "@/components/FunnelAnalysis";
import { ActionableInsights } from "@/components/ActionableInsights";
import { PredictiveAnalytics } from "@/components/PredictiveAnalytics";
import { WeeklyTrendChart } from "@/components/WeeklyTrendChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users, Calendar, TrendingUp, Target, Plus, Settings } from "lucide-react";

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

const overallMetrics = {
  totalLeadsGenerated: 2795,
  weeklyChange: 8.3,
  totalAppointmentsBooked: 62,
  appointmentWeeklyChange: -12.5,
  overallResponseRate: 4.9,
  responseRateWeeklyChange: 2.1,
  overallConversionRate: 15.2,
  conversionWeeklyChange: -5.8,
};

const funnelData = {
  tofu: {
    stage: "Lead Generation (TOFU)",
    prospects: 2795,
    conversionRate: 4.9,
    status: "good" as const,
    issue: null,
  },
  mofu: {
    stage: "Initial Response (MOFU)",
    prospects: 137,
    conversionRate: 15.2,
    status: "warning" as const,
    issue: "Response rate declining. Consider A/B testing new messaging approaches.",
  },
  bofu: {
    stage: "Appointments Booked (BOFU)",
    prospects: 62,
    conversionRate: 45.3,
    status: "critical" as const,
    issue: "Low appointment conversion. Improve follow-up cadence and value proposition.",
  },
};

const recommendations = [
  {
    id: 1,
    priority: "high" as const,
    category: "Lead Generation",
    action: "Create 5 new pieces of content targeting SaaS decision-makers",
    expectedImpact: "+20% lead volume in 2 weeks",
  },
  {
    id: 2,
    priority: "high" as const,
    category: "Follow-up",
    action: "Implement 3-touch follow-up sequence for non-responders",
    expectedImpact: "+8% response rate",
  },
  {
    id: 3,
    priority: "medium" as const,
    category: "Messaging",
    action: "A/B test new subject lines emphasizing ROI vs. features",
    expectedImpact: "+5% open rate",
  },
  {
    id: 4,
    priority: "low" as const,
    category: "Outreach Volume",
    action: "Increase daily outreach capacity by 15%",
    expectedImpact: "+12 appointments/month",
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

  const currentCampaign = selectedCampaign === "all" 
    ? null 
    : campaignData.find(c => c.id.toString() === selectedCampaign);

  const displayData = currentCampaign || {
    weeklyData: [
      { week: "Week 1", leads: 300, responses: 17, appointments: 7 },
      { week: "Week 2", leads: 365, responses: 23, appointments: 11 },
      { week: "Week 3", leads: 330, responses: 15, appointments: 9 },
      { week: "Week 4", leads: 370, responses: 28, appointments: 13 },
      { week: "Week 5", leads: 367, responses: 19, appointments: 8 },
      { week: "Week 6", leads: 407, responses: 20, appointments: 6 },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-primary-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                CampaignFlow Pro
              </h1>
              <p className="text-sm text-muted-foreground">B2B Cold Outreach Analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Campaign Selector */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Campaign:</label>
          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {campaignData.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id.toString()}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Leads Generated"
            value={overallMetrics.totalLeadsGenerated.toLocaleString()}
            change={overallMetrics.weeklyChange}
            subtitle="vs last week"
            icon={<Users className="w-4 h-4" />}
          />
          <MetricCard
            title="Appointments Booked"
            value={overallMetrics.totalAppointmentsBooked}
            change={overallMetrics.appointmentWeeklyChange}
            subtitle="vs last week"
            icon={<Calendar className="w-4 h-4" />}
          />
          <MetricCard
            title="Response Rate"
            value={`${overallMetrics.overallResponseRate}%`}
            change={overallMetrics.responseRateWeeklyChange}
            subtitle="vs last week"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <MetricCard
            title="Conversion Rate"
            value={`${overallMetrics.overallConversionRate}%`}
            change={overallMetrics.conversionWeeklyChange}
            subtitle="response to appointment"
            icon={<Target className="w-4 h-4" />}
          />
        </div>

        {/* Weekly Trends Chart */}
        <WeeklyTrendChart 
          data={displayData.weeklyData} 
          campaignName={currentCampaign?.name}
        />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <FunnelAnalysis data={funnelData} />
            <ActionableInsights recommendations={recommendations} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <PredictiveAnalytics
              currentPace={predictiveData.currentPace}
              projectedOutcome={predictiveData.projectedOutcome}
              budgetRecommendations={predictiveData.budgetRecommendations}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
