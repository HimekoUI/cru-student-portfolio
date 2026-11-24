import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET() {
  try {
    const sql = getSql();
    const [timeRow] = await sql`SELECT NOW() AS server_time`;
    const [skillsRow] = await sql`SELECT COUNT(*)::int AS skill_count FROM public.skills`;
    return NextResponse.json({
      status: "ok",
      database: "vercel-neon-postgres",
      serverTime: timeRow?.server_time ?? null,
      skillCount: skillsRow?.skill_count ?? 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Database error",
      },
      { status: 500 }
    );
  }
}
