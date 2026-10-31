import { NextRequest, NextResponse } from "next/server";
import { generateMatchExplanationWithGemma } from "@/lib/ai/gemma";
import { getAIModelInfo } from "@/lib/ai/config";
import { requireApiUser, unauthorizedResponse } from "@/lib/supabase/api";

export async function POST(req: NextRequest) {
  const auth = await requireApiUser();
  if (!auth.user) return unauthorizedResponse();
  if (!getAIModelInfo().is_live_configured) {
    return NextResponse.json({ error: "AI is not configured. Add a valid GEMINI_API_KEY." }, { status: 503 });
  }
  try {
    const body = await req.json();
    const { requesterNeed, candidate, compatibilityScore, matchingSkills, missingSkills } = body;

    if (!requesterNeed || !candidate) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const explanation = await generateMatchExplanationWithGemma({
      requesterNeed,
      candidate,
      compatibilityScore: Number(compatibilityScore) || 75,
      matchingSkills: Array.isArray(matchingSkills) ? matchingSkills : [],
      missingSkills: Array.isArray(missingSkills) ? missingSkills : [],
    });

    return NextResponse.json({
      success: true,
      data: explanation,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Explanation generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
