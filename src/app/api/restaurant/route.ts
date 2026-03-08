import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { buildEmailHtml, sendNotificationEmail } from "@/lib/mailer";
import { gatewayFireEvent } from "@/lib/pms-gateway";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { guest_name, guest_phone, reservation_date, reservation_time, party_size } = body;

        // 1. Save to Supabase
        const { data: inserted, error: dbError } = await supabase
            .from("restaurant_reservations")
            .insert([{ guest_name, guest_phone, date: reservation_date, time: reservation_time, party_size: parseInt(party_size) }])
            .select()
            .single();

        if (dbError) {
            console.error("DB error:", dbError);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        // 2. Fire PMS gateway event (non-blocking)
        gatewayFireEvent("reservation.created", inserted || { guest_name, guest_phone, reservation_date, reservation_time, party_size });

        // 3. Send email notification
        const html = buildEmailHtml(
            "New Table Reservation",
            [
                ["Guest Name", guest_name],
                ["Phone", guest_phone],
                ["Date", reservation_date],
                ["Time", reservation_time],
                ["Party Size", `${party_size} guests`],
                ["Received At", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
            ],
            "Please arrange the table and confirm with the guest by calling back on the number provided."
        );

        await sendNotificationEmail(`Table Reservation — ${guest_name} (${party_size} pax)`, html);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Restaurant route error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
