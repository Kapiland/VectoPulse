import { NextRequest, NextResponse } from "next/server";
import { getOpportunities, createOpportunity, updateOpportunityStatus } from "@/lib/data/store";
import { OpportunityCreateSchema } from "@/lib/schemas";
import { requireApiUser, unauthorizedResponse } from "@/lib/supabase/api";

export async function GET(req: NextRequest) {
  const auth = await requireApiUser();
  if (!auth.user) return unauthorizedResponse();
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q")?.toLowerCase();
    const verification = searchParams.get("verification");
    const sort = searchParams.get("sort") || "deadline"; // "deadline" | "newest"

    const { data: allOpportunities, isDatabase } = await getOpportunities();

    let filtered = [...allOpportunities];

    if (category && category !== "All") {
      filtered = filtered.filter((o) => o.category.toLowerCase() === category.toLowerCase());
    }

    if (verification && verification !== "All") {
      filtered = filtered.filter((o) => o.verification_status.toLowerCase() === verification.toLowerCase());
    }

    if (query) {
      filtered = filtered.filter(
        (o) =>
          o.title.toLowerCase().includes(query) ||
          o.organization.toLowerCase().includes(query) ||
          o.description.toLowerCase().includes(query) ||
          o.required_skills.some((s) => s.toLowerCase().includes(query))
      );
    }

    if (sort === "deadline") {
      filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sort === "newest") {
      filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
      isDatabase,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch opportunities";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireApiUser();
  if (!auth.user) return unauthorizedResponse();
  try {
    const body = await req.json();

    // Check if this is a status update action (bookmark / apply)
    if (body.action === "update_status") {
      const { opportunity_id, status } = body;
      if (!opportunity_id || !["Interested", "Applied", "Completed"].includes(status)) {
        return NextResponse.json({ error: "Missing status update parameters" }, { status: 400 });
      }
      const saved = await updateOpportunityStatus(opportunity_id, status);
      return NextResponse.json({ success: true, ...saved });
    }

    // Otherwise, it's creating a new opportunity
    const parsed = OpportunityCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Check for duplicate opportunity by title & organization
    const { data: existingOpps } = await getOpportunities();
    const isDuplicate = existingOpps.some(
      (o) =>
        o.title.toLowerCase().trim() === parsed.data.title.toLowerCase().trim() &&
        o.organization.toLowerCase().trim() === parsed.data.organization.toLowerCase().trim()
    );

    if (isDuplicate) {
      return NextResponse.json(
        { error: "An opportunity with this exact title and organization already exists on the Radar." },
        { status: 409 }
      );
    }

    const created = await createOpportunity(parsed.data);
    // The person who submits a notice is automatically tracking it, so its
    // deadline reminder appears without an extra save/bookmark step.
    await updateOpportunityStatus(created.data.id, "Interested");

    return NextResponse.json({
      success: true,
      ...created,
      message: "Opportunity saved to the Smart Opportunity Radar.",
    }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create opportunity";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
