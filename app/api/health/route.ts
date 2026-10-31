import { NextResponse } from "next/server";
import { getAIModelInfo } from "@/lib/ai/config";
import { getStudents } from "@/lib/data/store";
import { requireApiUser, unauthorizedResponse } from "@/lib/supabase/api";

export async function GET() {
  const ai = getAIModelInfo();
  const auth = await requireApiUser();
  if (!auth.user) return unauthorizedResponse();

  try {
    const { isDatabase } = await getStudents();
    const configured = ai.is_live_configured && isDatabase;

    return NextResponse.json({
      status: configured ? "ready" : "configuration_required",
      ai: {
        configured: ai.is_live_configured,
        gemini_model: ai.gemini_model,
        gemma_model: ai.gemma_model,
      },
      database: {
        configured: true,
        connected: isDatabase,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database connection failed";
    return NextResponse.json(
      {
        status: "unavailable",
        ai: {
          configured: ai.is_live_configured,
          gemini_model: ai.gemini_model,
          gemma_model: ai.gemma_model,
        },
        database: {
          configured: true,
          connected: false,
          error: message,
        },
      },
      { status: 503 }
    );
  }
}
