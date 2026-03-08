import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyInboundAPIKey } from "@/lib/pms-gateway";

export async function GET(req: NextRequest) {
    const apiKey = req.headers.get("x-pms-api-key");
    if (!(await verifyInboundAPIKey(apiKey))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const { data, error } = await supabaseAdmin
        .from("restaurant_reservations")
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
        source: "hotel_new_ganga_website",
        endpoint: "reservations",
        limit,
        offset,
        data,
    });
}
