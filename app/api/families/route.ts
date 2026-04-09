import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const community_id = searchParams.get("community_id");
  if (!community_id)
    return NextResponse.json({ error: "community_id required" }, { status: 400 });

  const { data: families, error: fErr } = await supabase
    .from("families")
    .select("*")
    .eq("community_id", community_id)
    .order("created_at", { ascending: true });

  if (fErr) return NextResponse.json({ error: fErr.message }, { status: 500 });

  const familyIds = (families || []).map((f) => f.id);
  if (familyIds.length === 0) return NextResponse.json([]);

  const { data: kids } = await supabase.from("kids").select("*").in("family_id", familyIds);
  const { data: availability } = await supabase.from("availability").select("*").in("family_id", familyIds);

  const enriched = (families || []).map((f) => ({
    ...f,
    kids: (kids || []).filter((k) => k.family_id === f.id),
    availability: (availability || []).filter((a) => a.family_id === f.id),
  }));

  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { community_id, parent_name, email, phone, address, lat, lng, seats, kids, availability } = body;

  const { data: family, error: fErr } = await supabase
    .from("families")
    .insert({ community_id, parent_name, email, phone, address, lat, lng, seats })
    .select()
    .single();

  if (fErr) {
    if (fErr.code === "23505")
      return NextResponse.json({ error: "This email is already registered in this community." }, { status: 409 });
    return NextResponse.json({ error: fErr.message }, { status: 500 });
  }

  if (kids?.length) {
    await supabase.from("kids").insert(
      kids.map((k: { name: string; grade: string }) => ({ ...k, family_id: family.id }))
    );
  }

  if (availability?.length) {
    await supabase.from("availability").insert(
      availability.map((a: Record<string, unknown>) => ({ ...a, family_id: family.id }))
    );
  }

  return NextResponse.json({ success: true, id: family.id });
}
