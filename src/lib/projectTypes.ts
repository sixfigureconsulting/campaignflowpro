import { Mail, TrendingUp, Calendar, Megaphone, Share2, FileText } from "lucide-react";
import React from "react";

export const PROJECT_TYPES = [
  { value: 'outbound_sales', label: 'Outbound Sales' },
  { value: 'inbound_marketing', label: 'Inbound Marketing' },
  { value: 'events', label: 'Events' },
  { value: 'paid_ads', label: 'Paid Ads' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'content_marketing', label: 'Content Marketing' },
] as const;

export type ProjectType = typeof PROJECT_TYPES[number]['value'];

export const PROJECT_TYPE_CONFIG: Record<ProjectType, { 
  label: string; 
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}> = {
  outbound_sales: { 
    label: 'Outbound Sales', 
    icon: Mail,
    color: 'bg-blue-500/10 text-blue-600 border-blue-200',
    description: 'Cold outreach, email campaigns, LinkedIn prospecting'
  },
  inbound_marketing: { 
    label: 'Inbound Marketing', 
    icon: TrendingUp,
    color: 'bg-green-500/10 text-green-600 border-green-200',
    description: 'SEO, blog content, lead magnets, organic traffic'
  },
  events: { 
    label: 'Events', 
    icon: Calendar,
    color: 'bg-purple-500/10 text-purple-600 border-purple-200',
    description: 'Webinars, conferences, trade shows, meetups'
  },
  paid_ads: { 
    label: 'Paid Ads', 
    icon: Megaphone,
    color: 'bg-orange-500/10 text-orange-600 border-orange-200',
    description: 'Google Ads, Facebook Ads, LinkedIn Ads, display'
  },
  social_media: { 
    label: 'Social Media', 
    icon: Share2,
    color: 'bg-pink-500/10 text-pink-600 border-pink-200',
    description: 'Organic social posts, engagement, community'
  },
  content_marketing: { 
    label: 'Content Marketing', 
    icon: FileText,
    color: 'bg-teal-500/10 text-teal-600 border-teal-200',
    description: 'Blogs, whitepapers, case studies, videos'
  },
};