import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function makeCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function POST(req: Request) {
  const { name, school_name, neighborhood } = await req.json();

  let code = makeCode();
  // Ensure uniqueness
  let attempts = 0;
  while (attempts < 5) {
    const { data } = await supabase.from("communities").select("id").eq("code", code).single();
    if (!data) break;
    code = makeCode();
    attempts++;
  }

  const { data, error } = await supabase
    .from("communities")
    .insert({ name, school_name, neighborhood, code })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
