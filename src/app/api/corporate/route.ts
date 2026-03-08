import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { buildEmailHtml, sendNotificationEmail } from "@/lib/mailer";
import { gatewayFireEvent } from "@/lib/pms-gateway";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { company_name, contact_person, email, phone, details } = body;

        // 1. Save to Supabase
        const { data: inserted, error: dbError } = await supabase
            .from("corporate_inquiries")
            .insert([{ company_name, contact_person, email, phone, details }])
            .select()
            .single();

        if (dbError) {
            console.error("DB error:", dbError);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        // 2. Fire PMS gateway event (non-blocking)
        gatewayFireEvent("inquiry.created", inserted || { company_name, contact_person, email, phone, details });

        // 3. Send email notification
        const html = buildEmailHtml(
            "New Corporate Inquiry",
            [
                ["Company", company_name],
                ["Contact Person", contact_person],
                ["Email", email],
                ["Phone", phone],
                ["Details", details],
                ["Received At", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
            ],
            "Follow up with the company's contact person at your earliest convenience. This could be a recurring corporate stay."
        );

        await sendNotificationEmail(`Corporate Inquiry — ${company_name}`, html);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Corporate route error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
