import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function requireApiUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { supabase, user: null };
  return { supabase, user };
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Please sign in to use this feature." }, { status: 401 });
}
