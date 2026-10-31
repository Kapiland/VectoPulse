import { NextRequest, NextResponse } from "next/server";
import { explainOpportunityRelevanceWithGemma } from "@/lib/ai/gemma";
import { getAIModelInfo } from "@/lib/ai/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category = "Hackathons", organization = "Campus Community", eligibility = "", skills = [] } = body;

    if (!title) {
      return NextResponse.json({ error: "Opportunity title is required" }, { status: 400 });
    }

    const relevance = await explainOpportunityRelevanceWithGemma({
      title,
      category,
      organization,
      eligibility,
      skills: Array.isArray(skills) ? skills : [String(skills)],
    });

    const modelInfo = getAIModelInfo();

    return NextResponse.json({
      success: true,
      data: relevance,
      model_info: modelInfo,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Classification failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
