import { NextRequest, NextResponse } from "next/server";
import { TeamMatchQuerySchema } from "@/lib/schemas";
import { getStudents } from "@/lib/data/store";
import { matchTeammates } from "@/lib/ai/matcher";
import { getAIModelInfo } from "@/lib/ai/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = TeamMatchQuerySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query payload", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { query, requester_id } = parsed.data;

    const { data: candidates } = await getStudents();

    const matches = await matchTeammates({
      requirement: query,
      candidates,
      excludeStudentId: requester_id,
    });

    const modelInfo = getAIModelInfo();

    return NextResponse.json({
      success: true,
      count: matches.length,
      data: matches,
      model_info: modelInfo,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Team matching engine error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
