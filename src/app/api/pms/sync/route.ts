import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyInboundAPIKey, gatewayFireEvent } from "@/lib/pms-gateway";

// POST /api/pms/sync — triggers a full data push from website to PMS
export async function POST(req: NextRequest) {
    const apiKey = req.headers.get("x-pms-api-key");
    if (!(await verifyInboundAPIKey(apiKey))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results: Record<string, string> = {};

    try {
        // Push all pending bookings
        const { data: bookings } = await supabaseAdmin
            .from("bookings")
            .select("*")
            .eq("status", "pending");

        for (const booking of bookings || []) {
            await gatewayFireEvent("booking.created", booking);
        }
        results.bookings = `${(bookings || []).length} pushed`;
    } catch (e) {
        results.bookings = `error: ${e}`;
    }

    try {
        // Push all restaurant reservations
        const { data: reservations } = await supabaseAdmin
            .from("restaurant_reservations")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(50);

        for (const reservation of reservations || []) {
            await gatewayFireEvent("reservation.created", reservation);
        }
        results.reservations = `${(reservations || []).length} pushed`;
    } catch (e) {
        results.reservations = `error: ${e}`;
    }

    try {
        // Push all corporate inquiries
        const { data: inquiries } = await supabaseAdmin
            .from("corporate_inquiries")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(50);

        for (const inquiry of inquiries || []) {
            await gatewayFireEvent("inquiry.created", inquiry);
        }
        results.inquiries = `${(inquiries || []).length} pushed`;
    } catch (e) {
        results.inquiries = `error: ${e}`;
    }

    return NextResponse.json({
        success: true,
        message: "Full sync triggered",
        results,
        timestamp: new Date().toISOString(),
    });
}
