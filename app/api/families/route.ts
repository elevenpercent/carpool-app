import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: families, error: fErr } = await supabase
    .from("families")
    .select("*")
    .order("created_at", { ascending: true });

  if (fErr) return NextResponse.json({ error: fErr.message }, { status: 500 });

  const { data: kids, error: kErr } = await supabase.from("kids").select("*");
  if (kErr) return NextResponse.json({ error: kErr.message }, { status: 500 });

  const { data: availability, error: aErr } = await supabase
    .from("availability")
    .select("*");
  if (aErr) return NextResponse.json({ error: aErr.message }, { status: 500 });

  const enriched = (families || []).map((f) => ({
    ...f,
    kids: (kids || []).filter((k) => k.family_id === f.id),
    availability: (availability || []).filter((a) => a.family_id === f.id),
  }));

  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { parent_name, email, phone, address, lat, lng, seats, kids, availability } = body;

  // Insert family
  const { data: family, error: fErr } = await supabase
    .from("families")
    .insert({ parent_name, email, phone, address, lat, lng, seats })
    .select()
    .single();

  if (fErr) {
    if (fErr.code === "23505") {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: fErr.message }, { status: 500 });
  }

  // Insert kids
  if (kids?.length) {
    const { error: kErr } = await supabase
      .from("kids")
      .insert(kids.map((k: { name: string; grade: string }) => ({ ...k, family_id: family.id })));
    if (kErr) return NextResponse.json({ error: kErr.message }, { status: 500 });
  }

  // Insert availability
  if (availability?.length) {
    const { error: aErr } = await supabase
      .from("availability")
      .insert(
        availability.map((a: Record<string, unknown>) => ({ ...a, family_id: family.id }))
      );
    if (aErr) return NextResponse.json({ error: aErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: family.id });
}
