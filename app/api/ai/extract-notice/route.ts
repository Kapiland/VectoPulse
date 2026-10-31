import { NextRequest, NextResponse } from "next/server";
import { NoticeExtractionRequestSchema } from "@/lib/schemas";
import { extractNoticeWithGemini } from "@/lib/ai/gemini";
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

    // 1. Input Validation
    const parsed = NoticeExtractionRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid notice payload format", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { text, imageBase64, mimeType } = parsed.data;

    // Check payload size limit (max 8MB)
    if (imageBase64 && imageBase64.length > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image file exceeds maximum allowable size of 8MB" },
        { status: 413 }
      );
    }

    if (!text && !imageBase64) {
      return NextResponse.json(
        { error: "Please provide either notice text or an image/document upload." },
        { status: 400 }
      );
    }

    // 2. Multimodal Extraction via Gemini with Prompt Injection Defense
    const extractionResult = await extractNoticeWithGemini({
      text,
      imageBase64,
      mimeType,
    });

    const modelInfo = getAIModelInfo();

    return NextResponse.json({
      success: true,
      data: extractionResult,
      model_info: modelInfo,
    });
  } catch (error: unknown) {
    console.error("Notice extraction API error:", error);
    const msg = error instanceof Error ? error.message : "Failed to extract notice content";
    return NextResponse.json(
      { error: "Internal server extraction failure", message: msg },
      { status: 500 }
    );
  }
}
