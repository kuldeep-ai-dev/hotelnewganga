import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
    try {
        const { error } = await supabaseAdmin
            .from("bookings")
            .delete()
            .eq("status", "cancelled");

        if (error) {
            console.error("Clear canceled error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "All cancelled bookings removed." });
    } catch (err) {
        console.error("Clear canceled API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
