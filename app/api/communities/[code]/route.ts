import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("code", code.toUpperCase())
    .single();

  if (error || !data)
    return NextResponse.json({ error: "Community not found" }, { status: 404 });

  return NextResponse.json(data);
}
