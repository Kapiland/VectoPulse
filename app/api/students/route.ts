import { NextRequest, NextResponse } from "next/server";
import { getStudents, getStudentById, updateStudent } from "@/lib/data/store";
import { StudentProfileSchema } from "@/lib/schemas";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const student = await getStudentById(id);
      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: student });
    }

    const { data: students, isDatabase } = await getStudents();
    return NextResponse.json({
      success: true,
      count: students.length,
      data: students,
      isDatabase,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch student profiles";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const parsed = StudentProfileSchema.partial().safeParse(updates);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid profile fields", details: parsed.error.issues }, { status: 400 });
    }

    const updated = await updateStudent(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Student not found to update" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Profile update failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
