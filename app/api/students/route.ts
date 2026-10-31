import { NextRequest, NextResponse } from "next/server";
import { getStudents, getStudentById, updateStudent } from "@/lib/data/store";
import { StudentProfileSchema } from "@/lib/schemas";
import { requireApiUser, unauthorizedResponse } from "@/lib/supabase/api";

export async function GET(req: NextRequest) {
  const auth = await requireApiUser();
  if (!auth.user) return unauthorizedResponse();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (searchParams.get("directory") === "1") {
      const { data } = await getStudents();
      return NextResponse.json({ success: true, count: data.length, data });
    }

    if (id && id !== auth.user.id) {
      return NextResponse.json({ error: "You can only view your own profile here." }, { status: 403 });
    }

    const student = await getStudentById(auth.user.id);
      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: student });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch student profiles";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireApiUser();
  if (!auth.user) return unauthorizedResponse();
  try {
    const body = await req.json();
    const parsed = StudentProfileSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid profile fields", details: parsed.error.issues }, { status: 400 });
    }

    const updated = await updateStudent(parsed.data);
    if (!updated.data) {
      return NextResponse.json({ error: "Student not found to update" }, { status: 404 });
    }

    return NextResponse.json({ success: true, ...updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Profile update failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
