import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogOut, TrendingUp, Target, Users, Calendar, RefreshCw, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/hooks/useProjects";
import { CreateCampaignDialog } from "@/components/CreateCampaignDialog";
import { EditableWeeklyData } from "@/components/EditableWeeklyData";
import { EditableInfrastructure } from "@/components/EditableInfrastructure";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyTrendChart } from "@/components/WeeklyTrendChart";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { PROJECT_TYPE_CONFIG, type ProjectType } from "@/lib/projectTypes";

const Dashboard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { projects, isLoading, error } = useProjects();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Find the specific project by ID
  const activeProject = projects?.find((p: any) => p.id === projectId);
  const brandColor = activeProject?.brand_color || "#4F46E5";
  const clientName = activeProject?.client_name || "CampaignFlow Pro";
  
  // Campaign tabs state - must be declared before any conditional returns
  const campaigns = activeProject?.campaigns || [];
  const [activeCampaignTab, setActiveCampaignTab] = useState<string>('');
  
  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['projects'] });
    toast({
      title: "Data refreshed",
      description: "Your dashboard has been updated with the latest data",
    });
  };
  
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
  }, [brandColor]);

  // Set active campaign tab when campaigns load - must be before conditional returns
  useEffect(() => {
    if (campaigns.length > 0 && !activeCampaignTab) {
      setActiveCampaignTab(campaigns[0].id);
    }
  }, [campaigns, activeCampaignTab]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your secure dashboard...</p>
          <p className="text-xs text-muted-foreground">Fetching data from your encrypted database</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load your data. Please refresh the page or contact support.
            </AlertDescription>
          </Alert>
          <Button variant="outline" onClick={signOut} className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Show empty state - redirect to main dashboard if project not found
  if (!activeProject) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
        <div className="text-center space-y-6 max-w-md">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Project Not Found</h1>
            <p className="text-muted-foreground">
              This project doesn't exist or you don't have access to it.
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard')} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const projectType = (activeProject?.project_type || 'outbound_sales') as ProjectType;
  const typeConfig = PROJECT_TYPE_CONFIG[projectType];

  // Calculate metrics from database
  const totalCampaigns = campaigns.length;
  
  const totalLeads = campaigns.reduce((sum: number, campaign: any) => {
    const weeklyData = campaign.weekly_data || [];
    return sum + weeklyData.reduce((wSum: number, week: any) => wSum + (week.leads_contacted || 0), 0);
  }, 0);

  const targetLeads = campaigns.reduce((sum: number, campaign: any) => 
    sum + (campaign.target_leads || 0), 0
  );

  const allocatedBudget = campaigns.reduce((sum: number, campaign: any) => 
    sum + (campaign.allocated_budget || 0), 0
  );

  const infrastructure = activeProject?.infrastructure?.[0];
  const totalMailboxes = infrastructure?.mailboxes || 0;
  const totalLinkedInAccounts = infrastructure?.linkedin_accounts || 0;

  // Main dashboard view
  const TypeIcon = typeConfig.icon;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Projects
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{activeProject?.name}</h1>
                  <Badge className={typeConfig.color}>
                    <TypeIcon className="h-3 w-3 mr-1" />
                    {typeConfig.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {clientName} • {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Security Banner */}
          <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <AlertDescription className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              Your data is secure and encrypted. Only you ({user?.email}) can access this project.
            </AlertDescription>
          </Alert>

          {/* Metrics Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Campaigns"
              value={totalCampaigns}
              change={0}
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <MetricCard
              title="Leads Contacted"
              value={totalLeads.toLocaleString()}
              change={0}
              subtitle={`Target: ${targetLeads.toLocaleString()}`}
              icon={<Users className="h-4 w-4" />}
            />
            <MetricCard
              title="Total Budget"
              value={`$${allocatedBudget.toLocaleString()}`}
              change={0}
              icon={<Target className="h-4 w-4" />}
            />
            <MetricCard
              title="Infrastructure"
              value={`${totalMailboxes + totalLinkedInAccounts}`}
              change={0}
              subtitle={`${totalMailboxes} mailboxes, ${totalLinkedInAccounts} LinkedIn`}
              icon={<Calendar className="h-4 w-4" />}
            />
          </div>

          {/* Campaigns & Data Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Campaign Management</h2>
              {activeProject && (
                <CreateCampaignDialog projectId={activeProject.id} />
              )}
            </div>
            
            {campaigns.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No campaigns yet. Click "Add Campaign" to create your first campaign. All data will be saved securely to your database.
                </AlertDescription>
              </Alert>
            ) : (
              <Tabs value={activeCampaignTab} onValueChange={setActiveCampaignTab}>
                <TabsList className="w-full justify-start">
                  {campaigns.map((campaign: any) => (
                    <TabsTrigger key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {campaigns.map((campaign: any) => {
                  // Prepare data for chart
                  const chartData = (campaign.weekly_data || []).map((week: any) => ({
                    week: `Week ${week.week_number}`,
                    leads: week.leads_contacted || 0,
                    responses: 0, // Placeholder
                    appointments: 0, // Placeholder
                  }));

                  return (
                    <TabsContent key={campaign.id} value={campaign.id} className="space-y-6">
                      {/* Campaign Summary */}
                      <div className="border rounded-lg p-6 bg-card">
                        <h3 className="font-semibold text-lg mb-4">{campaign.name}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Start Date</p>
                            <p className="font-medium">
                              {new Date(campaign.start_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Target Leads</p>
                            <p className="font-medium">{campaign.target_leads.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Budget</p>
                            <p className="font-medium">${campaign.allocated_budget.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Weeks Active</p>
                            <p className="font-medium">{campaign.weekly_data?.length || 0}</p>
                          </div>
                        </div>
                      </div>

                      {/* Performance Chart */}
                      {chartData.length > 0 && (
                        <WeeklyTrendChart
                          data={chartData}
                          campaignName={campaign.name}
                          goalAppointments={campaign.target_leads}
                        />
                      )}

                      {/* Editable Weekly Data */}
                      <EditableWeeklyData
                        campaignId={campaign.id}
                        campaignName={campaign.name}
                        weeklyData={campaign.weekly_data || []}
                      />
                    </TabsContent>
                  );
                })}
              </Tabs>
            )}
          </div>

          {/* Infrastructure Management */}
          {activeProject && (
            <EditableInfrastructure
              projectId={activeProject.id}
              infrastructure={infrastructure}
            />
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
