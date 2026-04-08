import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { seedDatabase } from "@/data/seed";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (!isDevelopment && session?.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await seedDatabase();
  return NextResponse.json({ ok: true, result });
}
