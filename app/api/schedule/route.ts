import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateSchedule } from "@/lib/scheduler";

export async function GET() {
  const { data: families } = await supabase.from("families").select("*");
  const { data: kids } = await supabase.from("kids").select("*");
  const { data: availability } = await supabase.from("availability").select("*");

  const enriched = (families || []).map((f) => ({
    ...f,
    kids: (kids || []).filter((k) => k.family_id === f.id),
    availability: (availability || []).filter((a) => a.family_id === f.id),
  }));

  const schedule = generateSchedule(enriched);
  return NextResponse.json(schedule);
}
