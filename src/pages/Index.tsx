import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BarChart3, Users, TrendingUp, Zap, Target, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BarChart3,
      title: "Smart Campaign Analytics",
      description: "Track performance across multiple campaigns with real-time insights and predictive forecasting."
    },
    {
      icon: Target,
      title: "Lead Generation at Scale",
      description: "Manage thousands of leads efficiently with automated tracking and intelligent funnel analysis."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Invite team members with granular permissions. View-only or full editing access - you control who sees what."
    },
    {
      icon: TrendingUp,
      title: "Predictive Budget Planning",
      description: "AI-powered budget recommendations based on your campaign performance and historical data."
    },
    {
      icon: Zap,
      title: "Multi-Channel Infrastructure",
      description: "Coordinate LinkedIn accounts and email mailboxes from a single unified dashboard."
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with role-based access control and email verification."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <main>
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Campaign Intelligence, Simplified
              </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              The AI-powered platform that transforms your outreach campaigns into predictable revenue engines
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 h-auto"
              onClick={() => navigate('/auth')}
            >
              Create a Free Account
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 h-auto"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
          </div>

          <div className="pt-8 text-sm text-muted-foreground">
            No credit card required • Free forever • Set up in 2 minutes
          </div>
        </div>

        {/* Hero Image/Screenshot Placeholder */}
        <div className="mt-16 rounded-lg border bg-card shadow-2xl overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <BarChart3 className="w-24 h-24 mx-auto text-primary/40" />
              <p className="text-muted-foreground">Dashboard Preview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to scale your campaigns
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From planning to execution to optimization - all in one intelligent platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-primary">10x</div>
              <div className="text-muted-foreground mt-2">Faster Campaign Setup</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">95%</div>
              <div className="text-muted-foreground mt-2">Forecast Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground mt-2">Real-time Tracking</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get started in minutes
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Create Your Account</h3>
              <p className="text-muted-foreground">Sign up for free in seconds. No credit card needed, no commitment required.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Set Up Your First Campaign</h3>
              <p className="text-muted-foreground">Define your goals, budget, and timeline. Our AI helps optimize your strategy from day one.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Track & Optimize</h3>
              <p className="text-muted-foreground">Watch your campaigns perform in real-time. Get insights and recommendations to maximize ROI.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to transform your campaigns?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join teams who are already scaling their outreach with intelligent automation
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6 h-auto"
            onClick={() => navigate('/auth')}
          >
            Create a Free Account
          </Button>
        </div>
      </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 CampaignFlow Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
