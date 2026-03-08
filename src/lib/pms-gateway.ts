import crypto from "crypto";
import { supabaseAdmin } from "./supabase-admin";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GatewayEvent =
    | "booking.created"
    | "booking.confirmed"
    | "booking.cancelled"
    | "reservation.created"
    | "inquiry.created";

export interface GatewayPayload {
    event: GatewayEvent;
    timestamp: string;
    source: "hotel_new_ganga_website";
    data: Record<string, unknown>;
}

// ─── Load PMS config from hotel_settings ─────────────────────────────────────

async function getPMSConfig() {
    const { data } = await supabaseAdmin
        .from("hotel_settings")
        .select("setting_key, setting_value")
        .in("setting_key", ["pms_enabled", "pms_webhook_url", "pms_webhook_secret"]);

    if (!data) return null;
    const map = Object.fromEntries(data.map((s: { setting_key: string; setting_value: string }) => [s.setting_key, s.setting_value]));

    if (map.pms_enabled !== "true" || !map.pms_webhook_url) return null;
    return map as { pms_enabled: string; pms_webhook_url: string; pms_webhook_secret: string };
}

// ─── HMAC-SHA256 signature ────────────────────────────────────────────────────

function signPayload(body: string, secret: string): string {
    return "sha256=" + crypto.createHmac("sha256", secret).update(body).digest("hex");
}

// ─── Core fire function ───────────────────────────────────────────────────────

export async function gatewayFireEvent(event: GatewayEvent, data: Record<string, unknown>): Promise<void> {
    try {
        const config = await getPMSConfig();
        if (!config) return; // PMS not configured or disabled — silent skip

        const payload: GatewayPayload = {
            event,
            timestamp: new Date().toISOString(),
            source: "hotel_new_ganga_website",
            data,
        };

        const body = JSON.stringify(payload);
        const signature = config.pms_webhook_secret ? signPayload(body, config.pms_webhook_secret) : "";

        const response = await fetch(config.pms_webhook_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Gateway-Event": event,
                "X-Gateway-Signature": signature,
                "X-Gateway-Source": "hotel_new_ganga_website",
            },
            body,
            signal: AbortSignal.timeout(10000),
        });

        console.log(`[PMS Gateway] Event "${event}" fired → ${response.status}`);

        // Log delivery to hotel_settings (last sync time)
        await supabaseAdmin
            .from("hotel_settings")
            .upsert(
                { setting_key: "pms_last_sync", setting_value: new Date().toISOString() },
                { onConflict: "setting_key" }
            );
    } catch (err) {
        // Non-blocking — never fail the main request because of gateway
        console.error(`[PMS Gateway] Failed to fire event "${event}":`, err);
    }
}

// ─── Auth helper for inbound API routes ─────────────────────────────────────

export async function verifyInboundAPIKey(providedKey: string | null): Promise<boolean> {
    if (!providedKey) return false;
    const { data } = await supabaseAdmin
        .from("hotel_settings")
        .select("setting_value")
        .eq("setting_key", "pms_inbound_api_key")
        .single();

    return !!(data?.setting_value && data.setting_value === providedKey);
}
