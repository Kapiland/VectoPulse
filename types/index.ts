export type OpportunityCategory = 
  | "Hackathons"
  | "Internships"
  | "Workshops"
  | "Scholarships"
  | "Competitions"
  | "Campus events"
  | "Tech conferences";

export type VerificationStatus = "Officially sourced" | "User submitted" | "Unverified";
export type SourceType = "Official notice" | "WhatsApp forward" | "Poster scan" | "Department portal" | "Website" | "User submitted";
export type ApplicationStatus = "Interested" | "Applied" | "Completed";

export interface Student {
  id: string;
  display_name: string;
  college: string;
  course: string;
  skills: string[];
  interests: string[];
  preferred_roles: string[];
  is_discoverable?: boolean;
  experience_level: "Beginner" | "Intermediate" | "Advanced";
  project_interests: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  description: string;
  eligibility: string;
  required_skills: string[];
  deadline: string; // ISO date string or formatted
  event_date?: string;
  location: string;
  registration_url: string;
  source_type: SourceType;
  verification_status: VerificationStatus;
  required_documents?: string[];
  important_instructions?: string;
  ai_relevance_summary?: string;
  created_at?: string;
}

export interface SavedOpportunity {
  id: string;
  student_id: string;
  opportunity_id: string;
  application_status: ApplicationStatus;
  created_at?: string;
}

export interface TeamMatchCandidate {
  student: Student;
  compatibility_score: number; // 0 - 100
  matching_skills: string[];
  missing_skills: string[];
  complementary_roles: string[];
  explanation: {
    english: string;
    hindi_simple?: string;
    key_strengths: string[];
    suggested_synergy: string;
  };
}

export interface ExtractedNoticeResponse {
  title: string;
  category: OpportunityCategory;
  organization: string;
  description: string;
  eligibility: string;
  required_skills: string[];
  deadline: string;
  event_date: string;
  location: string;
  registration_url: string;
  required_documents: string[];
  important_instructions: string;
  confidence_notes?: string;
  raw_extracted_at?: string;
  model_used: string;
  is_live_ai: boolean;
}

export interface AIModelStatus {
  gemini_model: string;
  gemma_model: string;
  is_gemini_active: boolean;
  is_gemma_active: boolean;
  active_provider: "google_ai_studio" | "heuristic_fallback";
  notice_count: number;
}
