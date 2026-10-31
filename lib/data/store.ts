import "server-only";

import { createClient } from "@/lib/supabase/server";
import { Opportunity, Student, SavedOpportunity, ApplicationStatus } from "@/types";

async function authenticatedClient() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Authentication required");
  return { supabase, user };
}

export async function getOpportunities(): Promise<{ data: Opportunity[]; isDatabase: true }> {
  const { supabase } = await authenticatedClient();
  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .gte("deadline", new Date().toISOString())
    .order("deadline");
  if (error) throw new Error(`Could not load opportunities: ${error.message}`);
  return { data: (data ?? []) as Opportunity[], isDatabase: true };
}

export async function createOpportunity(
  opp: Omit<Opportunity, "id" | "created_at">
): Promise<{ data: Opportunity; isDatabase: true }> {
  const { supabase, user } = await authenticatedClient();
  const databaseRecord = {
    ...opp,
    created_by: user.id,
    verification_status: "User submitted",
    // A notice that only lists a calendar date means applications close at
    // the end of that date in India, not at midnight UTC at its start.
    deadline: /^\d{4}-\d{2}-\d{2}$/.test(opp.deadline)
      ? new Date(`${opp.deadline}T23:59:59+05:30`).toISOString()
      : new Date(opp.deadline).toISOString(),
    event_date: opp.event_date && !Number.isNaN(Date.parse(opp.event_date))
      ? new Date(opp.event_date).toISOString()
      : null,
  };
  const { data, error } = await supabase.from("opportunities").insert(databaseRecord).select().single();
  if (error) throw new Error(`Could not save opportunity: ${error.message}`);
  return { data: data as Opportunity, isDatabase: true };
}

export async function getStudents(): Promise<{ data: Student[]; isDatabase: true }> {
  const { supabase } = await authenticatedClient();
  const { data, error } = await supabase.from("students").select("*").order("display_name");
  if (error) throw new Error(`Could not load student profiles: ${error.message}`);
  return { data: (data ?? []) as Student[], isDatabase: true };
}

export async function getStudentById(id: string): Promise<Student | null> {
  const { supabase, user } = await authenticatedClient();
  if (id !== user.id) return null;
  const { data, error } = await supabase.from("students").select("*").eq("id", user.id).maybeSingle();
  if (error) throw new Error(`Could not load student profile: ${error.message}`);
  return data as Student | null;
}

export async function updateStudent(updates: Partial<Student>): Promise<{ data: Student | null; isDatabase: true }> {
  const { supabase, user } = await authenticatedClient();
  const safeUpdates = { ...updates };
  delete safeUpdates.id;
  delete safeUpdates.created_at;
  delete safeUpdates.avatar_url;
  const { data, error } = await supabase.from("students").update(safeUpdates).eq("id", user.id).select().maybeSingle();
  if (error) throw new Error(`Could not save student profile: ${error.message}`);
  return { data: data as Student | null, isDatabase: true };
}

export async function getSavedOpportunities(): Promise<SavedOpportunity[]> {
  const { supabase, user } = await authenticatedClient();
  const { data, error } = await supabase.from("saved_opportunities").select("*").eq("student_id", user.id);
  if (error) throw new Error(`Could not load saved opportunities: ${error.message}`);
  return (data ?? []) as SavedOpportunity[];
}

export async function updateOpportunityStatus(
  opportunityId: string,
  status: ApplicationStatus
): Promise<{ data: SavedOpportunity; isDatabase: true }> {
  const { supabase, user } = await authenticatedClient();

  // Existing auth accounts may predate the signup trigger or may have been
  // created while the trigger was unavailable. Ensure the FK target exists
  // before saving an opportunity.
  const displayName = String(user.user_metadata?.display_name ?? "").trim()
    || user.email?.split("@")[0]
    || "Student";
  const { error: profileError } = await supabase.from("students").upsert(
    { id: user.id, display_name: displayName },
    { onConflict: "id", ignoreDuplicates: true }
  );
  if (profileError) throw new Error(`Could not prepare student profile: ${profileError.message}`);

  const { data, error } = await supabase.from("saved_opportunities").upsert(
    { student_id: user.id, opportunity_id: opportunityId, application_status: status },
    { onConflict: "student_id,opportunity_id" }
  ).select().single();
  if (error) throw new Error(`Could not update saved opportunity: ${error.message}`);
  return { data: data as SavedOpportunity, isDatabase: true };
}
