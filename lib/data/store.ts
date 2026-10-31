import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Opportunity, Student, SavedOpportunity, ApplicationStatus } from "@/types";
import { INITIAL_OPPORTUNITIES, INITIAL_STUDENTS } from "./mock-data";

// In-memory persistent cache for zero-config mode / local demo / fallback
let memoryOpportunities: Opportunity[] = [...INITIAL_OPPORTUNITIES];
let memoryStudents: Student[] = [...INITIAL_STUDENTS];
let memorySaved: SavedOpportunity[] = [
  {
    id: "saved-1",
    student_id: INITIAL_STUDENTS[0].id,
    opportunity_id: INITIAL_OPPORTUNITIES[0].id,
    application_status: "Interested",
    created_at: new Date().toISOString(),
  },
  {
    id: "saved-2",
    student_id: INITIAL_STUDENTS[0].id,
    opportunity_id: INITIAL_OPPORTUNITIES[2].id,
    application_status: "Applied",
    created_at: new Date().toISOString(),
  },
];

function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("your-project-id") || key.includes("your_supabase_anon_key")) {
    return null;
  }
  try {
    return createClient(url, key);
  } catch {
    return null;
  }
}

export async function getOpportunities(): Promise<{ data: Opportunity[]; isDatabase: boolean }> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("deadline", { ascending: true });
      if (!error && data && data.length > 0) {
        return { data: data as Opportunity[], isDatabase: true };
      }
    } catch (e) {
      console.warn("Supabase query error, falling back to local memory store:", e);
    }
  }
  return { data: memoryOpportunities, isDatabase: false };
}

export async function getOpportunityById(id: string): Promise<Opportunity | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) return data as Opportunity;
    } catch {
      // fallback
    }
  }
  return memoryOpportunities.find((o) => o.id === id) || null;
}

export async function createOpportunity(opp: Omit<Opportunity, "id" | "created_at">): Promise<Opportunity> {
  const newId = "opp-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);
  const newRecord: Opportunity = {
    ...opp,
    id: newId,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .insert([newRecord])
        .select()
        .single();
      if (!error && data) {
        memoryOpportunities.unshift(data as Opportunity);
        return data as Opportunity;
      }
    } catch (e) {
      console.warn("Supabase insert error, saving to memory store:", e);
    }
  }

  // Prepend to memory store so it immediately shows up first
  memoryOpportunities.unshift(newRecord);
  return newRecord;
}

export async function getStudents(): Promise<{ data: Student[]; isDatabase: boolean }> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("students").select("*");
      if (!error && data && data.length > 0) {
        return { data: data as Student[], isDatabase: true };
      }
    } catch {
      // fallback
    }
  }
  return { data: memoryStudents, isDatabase: false };
}

export async function getStudentById(id: string): Promise<Student | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) return data as Student;
    } catch {
      // fallback
    }
  }
  return memoryStudents.find((s) => s.id === id) || null;
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<Student | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("students")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        const idx = memoryStudents.findIndex((s) => s.id === id);
        if (idx !== -1) memoryStudents[idx] = data as Student;
        return data as Student;
      }
    } catch {
      // fallback
    }
  }

  const idx = memoryStudents.findIndex((s) => s.id === id);
  if (idx !== -1) {
    memoryStudents[idx] = { ...memoryStudents[idx], ...updates };
    return memoryStudents[idx];
  }
  return null;
}

export async function getSavedOpportunities(studentId: string): Promise<SavedOpportunity[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("saved_opportunities")
        .select("*")
        .eq("student_id", studentId);
      if (!error && data) return data as SavedOpportunity[];
    } catch {
      // fallback
    }
  }
  return memorySaved.filter((s) => s.student_id === studentId);
}

export async function updateOpportunityStatus(
  studentId: string,
  opportunityId: string,
  status: ApplicationStatus
): Promise<SavedOpportunity> {
  const existingIndex = memorySaved.findIndex(
    (s) => s.student_id === studentId && s.opportunity_id === opportunityId
  );

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("saved_opportunities")
        .upsert(
          {
            student_id: studentId,
            opportunity_id: opportunityId,
            application_status: status,
          },
          { onConflict: "student_id,opportunity_id" }
        )
        .select()
        .single();
      if (!error && data) {
        if (existingIndex !== -1) {
          memorySaved[existingIndex] = data as SavedOpportunity;
        } else {
          memorySaved.push(data as SavedOpportunity);
        }
        return data as SavedOpportunity;
      }
    } catch {
      // fallback
    }
  }

  if (existingIndex !== -1) {
    memorySaved[existingIndex].application_status = status;
    return memorySaved[existingIndex];
  }

  const newSaved: SavedOpportunity = {
    id: "saved-" + Date.now(),
    student_id: studentId,
    opportunity_id: opportunityId,
    application_status: status,
    created_at: new Date().toISOString(),
  };
  memorySaved.push(newSaved);
  return newSaved;
}
