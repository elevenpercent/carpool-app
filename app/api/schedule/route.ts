import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateSchedule } from "@/lib/scheduler";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const community_id = searchParams.get("community_id");
  if (!community_id)
    return NextResponse.json({ error: "community_id required" }, { status: 400 });

  const { data: families } = await supabase.from("families").select("*").eq("community_id", community_id);
  const familyIds = (families || []).map((f) => f.id);

  if (familyIds.length === 0) return NextResponse.json(generateSchedule([]));

  const { data: kids } = await supabase.from("kids").select("*").in("family_id", familyIds);
  const { data: availability } = await supabase.from("availability").select("*").in("family_id", familyIds);

  const enriched = (families || []).map((f) => ({
    ...f,
    kids: (kids || []).filter((k) => k.family_id === f.id),
    availability: (availability || []).filter((a) => a.family_id === f.id),
  }));

  return NextResponse.json(generateSchedule(enriched));
}
