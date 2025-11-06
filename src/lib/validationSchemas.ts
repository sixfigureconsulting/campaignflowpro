import { z } from 'zod';

// Authentication schemas
export const authSchema = {
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(72),
  fullName: z.string().trim().min(1, { message: "Name is required" }).max(100),
};

export const loginSchema = z.object({
  email: authSchema.email,
  password: authSchema.password,
});

export const signupSchema = z.object({
  email: authSchema.email,
  password: authSchema.password,
  fullName: authSchema.fullName,
});

// Project schemas
export const projectSchema = z.object({
  name: z.string().trim().min(1, { message: "Project name is required" }).max(100),
  client_name: z.string().trim().max(100).optional(),
  brand_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, { message: "Invalid hex color format" }).optional(),
  logo_url: z.string().url({ message: "Invalid URL format" }).optional().or(z.literal('')),
});

// Campaign schemas
export const campaignSchema = z.object({
  name: z.string().trim().min(1, { message: "Campaign name is required" }).max(200),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format (YYYY-MM-DD)" }),
  target_leads: z.number().int().positive({ message: "Target leads must be positive" }).max(1000000),
  allocated_budget: z.number().positive({ message: "Budget must be positive" }).max(100000000),
  target_outreach: z.number().int().nonnegative({ message: "Target outreach cannot be negative" }).max(1000000).optional(),
});

// Weekly data schemas
export const weeklyDataSchema = z.object({
  week_number: z.number().int().positive().max(52, { message: "Week number must be between 1 and 52" }),
  leads_contacted: z.number().int().nonnegative({ message: "Leads contacted cannot be negative" }).max(100000),
  target_outreach: z.number().int().nonnegative({ message: "Target outreach cannot be negative" }).max(100000).optional(),
});

// Infrastructure schemas
export const infrastructureSchema = z.object({
  mailboxes: z.number().int().nonnegative({ message: "Mailboxes cannot be negative" }).max(1000),
  linkedin_accounts: z.number().int().nonnegative({ message: "LinkedIn accounts cannot be negative" }).max(1000),
});
