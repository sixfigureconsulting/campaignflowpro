import { useNavigate } from "react-router-dom";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
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
  ArrowRight,
  Sparkles,
  BarChart3,
  Search
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/hooks/useProjects";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { ThemeSelector } from "@/components/ThemeSelector";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const PROJECT_TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; bgGradient: string }> = {
  outbound_sales: { 
    label: 'Outbound Sales', 
    icon: <Mail className="h-5 w-5" />,
    color: 'text-blue-600',
    bgGradient: 'from-blue-500/20 to-blue-600/5'
  },
  seo: { 
    label: 'SEO', 
    icon: <Search className="h-5 w-5" />,
    color: 'text-green-600',
    bgGradient: 'from-green-500/20 to-green-600/5'
  },
  events: { 
    label: 'Events', 
    icon: <Calendar className="h-5 w-5" />,
    color: 'text-purple-600',
    bgGradient: 'from-purple-500/20 to-purple-600/5'
  },
  paid_ads: { 
    label: 'Paid Ads', 
    icon: <Megaphone className="h-5 w-5" />,
    color: 'text-orange-600',
    bgGradient: 'from-orange-500/20 to-orange-600/5'
  },
  social_media: { 
    label: 'Social Media', 
    icon: <Share2 className="h-5 w-5" />,
    color: 'text-pink-600',
    bgGradient: 'from-pink-500/20 to-pink-600/5'
  },
  content_marketing: { 
    label: 'Content Marketing', 
    icon: <FileText className="h-5 w-5" />,
    color: 'text-teal-600',
    bgGradient: 'from-teal-500/20 to-teal-600/5'
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
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

  const projectsByType = allProjects.reduce((acc: Record<string, any[]>, project: any) => {
    const type = project.project_type || 'outbound_sales';
    if (!acc[type]) acc[type] = [];
    acc[type].push(project);
    return acc;
  }, {});

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

  const maxLeads = Math.max(...leadsByType.map(l => l.leads), 1);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-b bg-gradient-to-br from-card via-card to-primary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">CampaignFlow Pro</h1>
              </div>
              <p className="text-muted-foreground">
                Welcome back, <span className="font-medium text-foreground">{user?.email?.split('@')[0]}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh} 
                disabled={isLoading}
                className="bg-background/50 backdrop-blur hover:bg-background"
              >
                <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && 'animate-spin')} />
                Refresh
              </Button>
              <ThemeSelector />
              <CreateProjectDialog />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-10">
          {/* Stats Grid */}
          <section className="animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Performance Overview
              </h2>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Active Projects"
                value={totalProjects}
                icon={<Target className="h-5 w-5" />}
                accentColor="primary"
                subtitle={`${Object.keys(projectsByType).length} activity types`}
              />
              <MetricCard
                title="Total Campaigns"
                value={totalCampaigns}
                icon={<TrendingUp className="h-5 w-5" />}
                accentColor="success"
                subtitle="Across all projects"
              />
              <MetricCard
                title="Total Leads"
                value={totalLeads.toLocaleString()}
                icon={<Users className="h-5 w-5" />}
                accentColor="warning"
                subtitle="Contacts reached"
              />
              <MetricCard
                title="Total Budget"
                value={`$${totalBudget.toLocaleString()}`}
                icon={<DollarSign className="h-5 w-5" />}
                accentColor="primary"
                subtitle="Allocated spend"
              />
            </div>
          </section>

          {/* Activity Breakdown */}
          {leadsByType.length > 0 && (
            <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Performance by Activity
                </h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {leadsByType.map(({ type, leads, count }, index) => {
                  const config = PROJECT_TYPE_CONFIG[type] || PROJECT_TYPE_CONFIG.outbound_sales;
                  const percentage = maxLeads > 0 ? (leads / maxLeads) * 100 : 0;
                  
                  return (
                    <Card 
                      key={type} 
                      className={cn(
                        "relative overflow-hidden border-0 bg-gradient-to-br transition-all duration-300 hover:shadow-primary-lg hover:-translate-y-1",
                        config.bgGradient
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={cn("p-2.5 rounded-xl bg-background/80", config.color)}>
                            {config.icon}
                          </div>
                          <Badge variant="secondary" className="bg-background/80 font-normal">
                            {count} project{count !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{config.label}</p>
                            <p className="text-2xl font-bold">{leads.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">leads contacted</p>
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="h-2 rounded-full bg-background/50 overflow-hidden">
                              <div 
                                className={cn("h-full rounded-full transition-all duration-700 ease-out", config.color.replace('text-', 'bg-'))}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground text-right">
                              {percentage.toFixed(0)}% of top performer
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* Projects Grid */}
          <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Projects
                </h2>
                <Badge variant="outline" className="ml-2">{allProjects.length}</Badge>
              </div>
              <CreateProjectDialog />
            </div>
            
            {allProjects.length === 0 ? (
              <Card className="border-dashed border-2 bg-muted/30">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-6">
                      <Target className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Start Your First Project</h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">
                    Create a project to begin tracking your marketing and sales activities across any channel.
                  </p>
                  <CreateProjectDialog />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {allProjects.map((project: any, index: number) => {
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
                      className="group relative overflow-hidden border hover:border-primary/30 transition-all duration-300 hover:shadow-primary-lg cursor-pointer"
                      onClick={() => navigate(`/project/${project.id}`)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Type indicator stripe */}
                      <div className={cn(
                        "absolute top-0 left-0 right-0 h-1 transition-all duration-300",
                        typeConfig.color.replace('text-', 'bg-'),
                        "opacity-60 group-hover:opacity-100"
                      )} />
                      
                      <CardContent className="p-6 pt-7">
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-1 flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                              {project.name}
                            </h3>
                            {project.client_name && (
                              <p className="text-sm text-muted-foreground truncate">{project.client_name}</p>
                            )}
                          </div>
                          <div className="ml-4 p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-5">
                          <div className={cn("p-1.5 rounded-lg", typeConfig.color.replace('text-', 'bg-') + '/10')}>
                            <div className={typeConfig.color}>
                              {typeConfig.icon}
                            </div>
                          </div>
                          <span className={cn("text-sm font-medium", typeConfig.color)}>
                            {typeConfig.label}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{campaignCount}</p>
                            <p className="text-xs text-muted-foreground">Campaigns</p>
                          </div>
                          <div className="text-center border-x">
                            <p className="text-2xl font-bold">{projectLeads.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Leads</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">${projectBudget >= 1000 ? `${(projectBudget / 1000).toFixed(0)}k` : projectBudget}</p>
                            <p className="text-xs text-muted-foreground">Budget</p>
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
