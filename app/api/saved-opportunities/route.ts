import { NextResponse } from "next/server";
import { getSavedOpportunities } from "@/lib/data/store";
import { requireApiUser, unauthorizedResponse } from "@/lib/supabase/api";

export async function GET() {
  const auth = await requireApiUser();
  if (!auth.user) return unauthorizedResponse();
  try {
    const data = await getSavedOpportunities();
    return NextResponse.json({ success: true, count: data.length, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load saved opportunities";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
