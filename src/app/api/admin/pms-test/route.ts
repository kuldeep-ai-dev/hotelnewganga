import { NextRequest, NextResponse } from "next/server";

const PMS_PROVIDERS: Record<string, { testUrl: (baseUrl: string, apiKey: string) => string, headers: (apiKey: string) => Record<string, string> }> = {
    geny_pms: {
        testUrl: (baseUrl) => `${baseUrl || "https://api.mediageny.com"}/v1/status`,
        headers: (apiKey) => ({ Authorization: `Bearer ${apiKey}` }),
    },
    geny_pms_pro: {
        testUrl: (baseUrl) => `${baseUrl || "https://api.mediageny.com"}/v1/status`,
        headers: (apiKey) => ({ Authorization: `Bearer ${apiKey}` }),
    },
    geny_pms_cloud: {
        testUrl: (baseUrl) => `${baseUrl || "https://cloud.mediageny.com"}/v1/status`,
        headers: (apiKey) => ({ Authorization: `Bearer ${apiKey}` }),
    },
    hotelogix: {
        testUrl: (baseUrl) => `${baseUrl || "https://api.hotelogix.com"}/v1/properties`,
        headers: (apiKey) => ({ "x-api-key": apiKey }),
    },
    ezee: {
        testUrl: (baseUrl) => `${baseUrl || "https://live.ipms247.com"}/booking/reservation_api/listing.php`,
        headers: (apiKey) => ({ Authorization: `Bearer ${apiKey}` }),
    },
};

export async function POST(req: NextRequest) {
    try {
        const { provider, api_key, base_url } = await req.json();

        if (!provider || !api_key) {
            return NextResponse.json({ success: false, message: "Provider and API Key are required." }, { status: 400 });
        }

        const providerConfig = PMS_PROVIDERS[provider] || PMS_PROVIDERS.custom;
        const testUrl = providerConfig.testUrl(base_url, api_key);
        const headers = providerConfig.headers(api_key);

        if (!testUrl) {
            return NextResponse.json({ success: false, message: "Please provide a Base URL for custom PMS providers." }, { status: 400 });
        }

        const response = await fetch(testUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json", ...headers },
            signal: AbortSignal.timeout(8000),
        });

        // 401 means API key was rejected - server was reachable but key is wrong
        // 403 means forbidden - similar to 401
        // 200-299 means fully working
        // Other status codes = reachable but response varies by PMS
        if (response.ok) {
            return NextResponse.json({ success: true, message: `✅ Connection successful! PMS responded with status ${response.status}.` });
        } else if (response.status === 401 || response.status === 403) {
            return NextResponse.json({ success: false, message: `❌ Server reachable but API key was rejected (${response.status}). Please check your API key.` });
        } else {
            return NextResponse.json({ success: true, message: `⚠️ PMS server reachable (status ${response.status}). Credentials may be valid — check your PMS dashboard to confirm.` });
        }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        if (message.includes("timeout") || message.includes("AbortError")) {
            return NextResponse.json({ success: false, message: "❌ Connection timed out. Please check the Base URL and your network." });
        }
        return NextResponse.json({ success: false, message: `❌ Could not connect: ${message}` });
    }
}
