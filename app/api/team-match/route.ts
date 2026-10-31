import { NextRequest, NextResponse } from "next/server";
import { TeamMatchQuerySchema } from "@/lib/schemas";
import { getStudents } from "@/lib/data/store";
import { matchTeammates } from "@/lib/ai/matcher";
import { getAIModelInfo } from "@/lib/ai/config";
import { requireApiUser, unauthorizedResponse } from "@/lib/supabase/api";

export async function POST(req: NextRequest) {
  const auth = await requireApiUser();
  if (!auth.user) return unauthorizedResponse();
  try {
    const body = await req.json();
    const parsed = TeamMatchQuerySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query payload", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { query } = parsed.data;

    const { data: candidates } = await getStudents();

    const matches = await matchTeammates({
      requirement: query,
      candidates,
      excludeStudentId: auth.user.id,
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
