import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
    try {
        const { error } = await supabaseAdmin
            .from("bookings")
            .delete()
            .neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all rows

        if (error) {
            console.error("Clear all bookings error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "All bookings permanently removed." });
    } catch (err) {
        console.error("Clear all API error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
