import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
    const today = new Date().toISOString().split('T')[0];

    // 1. Fetch all bookings to see their check_out dates
    const { data: allBookings, error: fetchErr } = await supabaseAdmin
        .from("bookings")
        .select("id, check_out, status");

    if (fetchErr) return NextResponse.json({ error: fetchErr.message });

    // 2. Perform a dry-run select to see which ones would be deleted
    const { data: wouldDelete, error: deleteErr } = await supabaseAdmin
        .from("bookings")
        .select("id, check_out")
        .lt("check_out", today);

    // 3. Optional: actually delete and see what it returns
    const { data: deleteRes, error: actDelErr } = await supabaseAdmin
        .from("bookings")
        .delete()
        .lt("check_out", today)
        .select(); // .select() returns the deleted rows

    return NextResponse.json({
        today_string: today,
        total_bookings: allBookings,
        would_delete_count: wouldDelete?.length,
        would_delete: wouldDelete,
        actual_deleted: deleteRes,
        error: actDelErr
    });
}
