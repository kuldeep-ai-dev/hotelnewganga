import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyInboundAPIKey } from "@/lib/pms-gateway";

export async function GET(req: NextRequest) {
    const apiKey = req.headers.get("x-pms-api-key");
    if (!(await verifyInboundAPIKey(apiKey))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
        .from("rooms")
        .select("*")
        .order("display_order", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
        source: "hotel_new_ganga_website",
        endpoint: "rooms",
        data,
    });
}
