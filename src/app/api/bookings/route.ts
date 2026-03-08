import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { buildEmailHtml, sendNotificationEmail } from "@/lib/mailer";
import { gatewayFireEvent } from "@/lib/pms-gateway";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { guest_name, guest_email, guest_phone, room_category, check_in, check_out } = body;

        // 1. Save to Supabase
        const { data: inserted, error: dbError } = await supabase
            .from("bookings")
            .insert([{ guest_name, guest_email, guest_phone, room_category, check_in, check_out }])
            .select()
            .single();

        if (dbError) {
            console.error("DB error:", dbError);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        // 2. Fire PMS gateway event (non-blocking)
        gatewayFireEvent("booking.created", inserted || { guest_name, guest_email, guest_phone, room_category, check_in, check_out });

        // 3. Send email notification
        const html = buildEmailHtml(
            "New Room Booking Request",
            [
                ["Guest Name", guest_name],
                ["Email", guest_email],
                ["Phone", guest_phone],
                ["Room Type", room_category],
                ["Check-In", check_in],
                ["Check-Out", check_out],
                ["Received At", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
            ],
            "Please review and confirm this booking from the <strong>Admin Panel</strong> as soon as possible."
        );

        await sendNotificationEmail(`Room Booking — ${guest_name}`, html);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Booking route error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
