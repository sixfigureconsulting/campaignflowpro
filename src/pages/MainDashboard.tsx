import { useNavigate } from "react-router-dom";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign,
  Mail,
  Megaphone,
  Calendar,
  Share2,
  FileText,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/hooks/useProjects";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const PROJECT_TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  outbound_sales: { 
    label: 'Outbound Sales', 
    icon: <Mail className="h-4 w-4" />,
    color: 'bg-blue-500/10 text-blue-600 border-blue-200'
  },
  inbound_marketing: { 
    label: 'Inbound Marketing', 
    icon: <TrendingUp className="h-4 w-4" />,
    color: 'bg-green-500/10 text-green-600 border-green-200'
  },
  events: { 
    label: 'Events', 
    icon: <Calendar className="h-4 w-4" />,
    color: 'bg-purple-500/10 text-purple-600 border-purple-200'
  },
  paid_ads: { 
    label: 'Paid Ads', 
    icon: <Megaphone className="h-4 w-4" />,
    color: 'bg-orange-500/10 text-orange-600 border-orange-200'
  },
  social_media: { 
    label: 'Social Media', 
    icon: <Share2 className="h-4 w-4" />,
    color: 'bg-pink-500/10 text-pink-600 border-pink-200'
  },
  content_marketing: { 
    label: 'Content Marketing', 
    icon: <FileText className="h-4 w-4" />,
    color: 'bg-teal-500/10 text-teal-600 border-teal-200'
  },
};

const MainDashboard = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { projects, isLoading, error } = useProjects();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['projects'] });
    toast({
      title: "Data refreshed",
      description: "Your dashboard has been updated with the latest data",
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
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

  // Calculate aggregate metrics across all projects
  const allProjects = projects || [];
  const totalProjects = allProjects.length;
  
  const totalCampaigns = allProjects.reduce((sum, project: any) => 
    sum + (project.campaigns?.length || 0), 0
  );
  
  const totalLeads = allProjects.reduce((projectSum, project: any) => {
    const campaigns = project.campaigns || [];
    return projectSum + campaigns.reduce((campaignSum: number, campaign: any) => {
      const weeklyData = campaign.weekly_data || [];
      return campaignSum + weeklyData.reduce((weekSum: number, week: any) => 
        weekSum + (week.leads_contacted || 0), 0
      );
    }, 0);
  }, 0);

  const totalBudget = allProjects.reduce((projectSum, project: any) => {
    const campaigns = project.campaigns || [];
    return projectSum + campaigns.reduce((campaignSum: number, campaign: any) => 
      campaignSum + (campaign.allocated_budget || 0), 0
    );
  }, 0);

  // Group projects by type for breakdown
  const projectsByType = allProjects.reduce((acc: Record<string, any[]>, project: any) => {
    const type = project.project_type || 'outbound_sales';
    if (!acc[type]) acc[type] = [];
    acc[type].push(project);
    return acc;
  }, {});

  // Calculate leads by project type
  const leadsByType = Object.entries(projectsByType).map(([type, typeProjects]) => {
    const leads = (typeProjects as any[]).reduce((projectSum, project) => {
      const campaigns = project.campaigns || [];
      return projectSum + campaigns.reduce((campaignSum: number, campaign: any) => {
        const weeklyData = campaign.weekly_data || [];
        return campaignSum + weeklyData.reduce((weekSum: number, week: any) => 
          weekSum + (week.leads_contacted || 0), 0
        );
      }, 0);
    }, 0);
    return { type, leads, count: (typeProjects as any[]).length };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">CampaignFlow Pro</h1>
              <p className="text-sm text-muted-foreground">
                Main Dashboard • {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <CreateProjectDialog />
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
          {/* Summary Metrics */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Active Projects"
                value={totalProjects}
                change={0}
                icon={<Target className="h-4 w-4" />}
              />
              <MetricCard
                title="Total Campaigns"
                value={totalCampaigns}
                change={0}
                icon={<TrendingUp className="h-4 w-4" />}
              />
              <MetricCard
                title="Total Leads"
                value={totalLeads.toLocaleString()}
                change={0}
                icon={<Users className="h-4 w-4" />}
              />
              <MetricCard
                title="Total Budget"
                value={`$${totalBudget.toLocaleString()}`}
                change={0}
                icon={<DollarSign className="h-4 w-4" />}
              />
            </div>
          </section>

          {/* Leads by Type Breakdown */}
          {leadsByType.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4">Performance by Activity Type</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {leadsByType.map(({ type, leads, count }) => {
                  const config = PROJECT_TYPE_CONFIG[type] || PROJECT_TYPE_CONFIG.outbound_sales;
                  return (
                    <Card key={type} className="bg-card hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {config.icon}
                            <span className="font-medium">{config.label}</span>
                          </div>
                          <Badge variant="secondary">{count} project{count !== 1 ? 's' : ''}</Badge>
                        </div>
                        <p className="text-2xl font-bold">{leads.toLocaleString()} leads</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* Projects Grid */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Your Projects</h2>
              <CreateProjectDialog />
            </div>
            
            {allProjects.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create your first project to start tracking your marketing and sales activities.
                  </p>
                  <CreateProjectDialog />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allProjects.map((project: any) => {
                  const typeConfig = PROJECT_TYPE_CONFIG[project.project_type] || PROJECT_TYPE_CONFIG.outbound_sales;
                  const campaignCount = project.campaigns?.length || 0;
                  const projectLeads = (project.campaigns || []).reduce((sum: number, c: any) => {
                    return sum + (c.weekly_data || []).reduce((wSum: number, w: any) => 
                      wSum + (w.leads_contacted || 0), 0
                    );
                  }, 0);
                  const projectBudget = (project.campaigns || []).reduce((sum: number, c: any) => 
                    sum + (c.allocated_budget || 0), 0
                  );

                  return (
                    <Card 
                      key={project.id} 
                      className="hover:shadow-lg transition-all cursor-pointer group"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {project.name}
                            </CardTitle>
                            {project.client_name && (
                              <p className="text-sm text-muted-foreground">{project.client_name}</p>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Badge className={typeConfig.color}>
                          <span className="flex items-center gap-1">
                            {typeConfig.icon}
                            {typeConfig.label}
                          </span>
                        </Badge>
                        
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Campaigns</p>
                            <p className="font-semibold">{campaignCount}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Leads</p>
                            <p className="font-semibold">{projectLeads.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Budget</p>
                            <p className="font-semibold">${projectBudget.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;