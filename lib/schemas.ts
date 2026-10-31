import { z } from "zod";

export const CATEGORIES = [
  "Hackathons",
  "Internships",
  "Workshops",
  "Scholarships",
  "Competitions",
  "Campus events",
  "Tech conferences",
] as const;

export const VERIFICATION_STATUSES = [
  "Officially sourced",
  "User submitted",
  "Unverified",
] as const;

export const SOURCE_TYPES = [
  "Official notice",
  "WhatsApp forward",
  "Poster scan",
  "Department portal",
  "Website",
  "User submitted",
] as const;

// Strict AI Extraction Schema for Gemini output
export const ExtractedOpportunityZodSchema = z.object({
  title: z.string().min(1, "Title is required").default("Unknown Opportunity"),
  category: z.enum(CATEGORIES).catch("Hackathons"),
  organization: z.string().min(1).default("Unknown Organization"),
  description: z.string().min(1).default("No description provided in notice."),
  eligibility: z.string().min(1).default("Open to all students or criteria not specified"),
  required_skills: z.array(z.string()).default([]),
  deadline: z.string().min(1).default("Unknown / Check Portal"),
  event_date: z.string().default("Unknown / To be announced"),
  location: z.string().default("Online / Check circular"),
  registration_url: z.string().url().catch("https://campussignal.internal/unverified-link"),
  required_documents: z.array(z.string()).default([]),
  important_instructions: z.string().default("None listed"),
});

// Schema for /api/ai/extract-notice request
export const NoticeExtractionRequestSchema = z.object({
  // The browser sends `null` for the inactive input (for example, no upload).
  // Accept it and normalize it to an omitted value instead of rejecting the
  // entire request before extraction starts.
  text: z.string().nullish().transform((value) => value?.trim() || undefined),
  imageBase64: z.string().nullish().transform((value) => value || undefined),
  pdfBase64: z.string().nullish().transform((value) => value || undefined),
  mimeType: z.string().nullish().transform((value) => value || undefined),
  sourceType: z.enum(SOURCE_TYPES).default("WhatsApp forward"),
});

// Schema for creating/editing an opportunity
export const OpportunityCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  organization: z.string().min(2, "Organization is required"),
  category: z.enum(CATEGORIES),
  description: z.string().min(10, "Description must be at least 10 characters"),
  eligibility: z.string().min(2, "Eligibility is required"),
  required_skills: z.array(z.string()).min(1, "At least one skill is required"),
  deadline: z.string()
    .min(1, "Deadline is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid deadline date before saving"),
  event_date: z.string().optional().default(""),
  location: z.string().default("Online"),
  registration_url: z.string().url("Must be a valid URL"),
  source_type: z.enum(SOURCE_TYPES).default("User submitted"),
  verification_status: z.enum(VERIFICATION_STATUSES).default("User submitted"),
  required_documents: z.array(z.string()).optional().default([]),
  important_instructions: z.string().optional().default(""),
});

// Schema for team matching search
export const TeamMatchQuerySchema = z.object({
  requester_id: z.string().optional(),
  query: z.string().min(3, "Requirement must be at least 3 characters"),
  target_roles: z.array(z.string()).optional(),
  required_skills: z.array(z.string()).optional(),
});

// Schema for student profile update
export const StudentProfileSchema = z.object({
  display_name: z.string().min(2, "Name must be at least 2 characters"),
  college: z.string().min(2, "College is required"),
  course: z.string().min(2, "Course is required"),
  skills: z.array(z.string()).min(1, "Please provide at least 1 skill"),
  interests: z.array(z.string()).default([]),
  preferred_roles: z.array(z.string()).min(1, "Please provide at least 1 role"),
  is_discoverable: z.boolean().optional(),
  experience_level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  project_interests: z.string().default(""),
});
