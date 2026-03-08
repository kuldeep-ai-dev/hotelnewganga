"use client";

import { useState, useEffect, useCallback } from "react";
import { Plug, Save, RefreshCw, CheckCircle, XCircle, Eye, EyeOff, AlertTriangle, Zap, Key, Globe } from "lucide-react";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";

const PMS_PROVIDERS = [
    { value: "", label: "-- Select a PMS Provider --" },
    { value: "geny_pms", label: "Geny PMS by MediaGeny" },
    { value: "geny_pms_pro", label: "GenyPMS Pro Plus" },
    { value: "geny_pms_cloud", label: "Geny PMS Cloud" },
    { value: "ezee", label: "eZee Absolute" },
    { value: "hotelogix", label: "Hotelogix" },
];

const PROVIDER_DOCS: Record<string, string> = {
    geny_pms: "https://mediageny.com",
    geny_pms_pro: "https://mediageny.com",
    geny_pms_cloud: "https://mediageny.com",
    ezee: "https://www.ezeeabsolute.com/api",
    hotelogix: "https://www.hotelogix.com/api-documentation",
};

const ALL_KEYS = [
    "pms_enabled", "pms_provider", "pms_api_key", "pms_api_secret", "pms_base_url",
    "pms_webhook_url", "pms_webhook_secret", "pms_inbound_api_key", "pms_last_sync",
];

interface Setting { setting_key: string; setting_value: string; }

export default function PMSConfigPage() {
    const [config, setConfig] = useState({
        pms_enabled: false,
        pms_provider: "",
        pms_api_key: "",
        pms_api_secret: "",
        pms_base_url: "",
        pms_webhook_url: "",
        pms_webhook_secret: "",
        pms_inbound_api_key: "",
        pms_last_sync: "",
    });

    const [show, setShow] = useState({ apiKey: false, apiSecret: false, webhookSecret: false, inboundKey: false });
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [syncResult, setSyncResult] = useState<string | null>(null);
    const [saveMessage, setSaveMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const loadSettings = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("hotel_settings")
            .select("setting_key, setting_value")
            .in("setting_key", ALL_KEYS);

        if (!error && data) {
            const map = Object.fromEntries((data as Setting[]).map((s) => [s.setting_key, s.setting_value]));
            setConfig({
                pms_enabled: map.pms_enabled === "true",
                pms_provider: map.pms_provider || "",
                pms_api_key: map.pms_api_key || "",
                pms_api_secret: map.pms_api_secret || "",
                pms_base_url: map.pms_base_url || "",
                pms_webhook_url: map.pms_webhook_url || "",
                pms_webhook_secret: map.pms_webhook_secret || "",
                pms_inbound_api_key: map.pms_inbound_api_key || "",
                pms_last_sync: map.pms_last_sync || "",
            });
        }
        setIsLoading(false);
    }, []);

    useEffect(() => { loadSettings(); }, [loadSettings]);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage("");
        const upserts = [
            { setting_key: "pms_enabled", setting_value: String(config.pms_enabled) },
            { setting_key: "pms_provider", setting_value: config.pms_provider },
            { setting_key: "pms_api_key", setting_value: config.pms_api_key },
            { setting_key: "pms_api_secret", setting_value: config.pms_api_secret },
            { setting_key: "pms_base_url", setting_value: config.pms_base_url },
            { setting_key: "pms_webhook_url", setting_value: config.pms_webhook_url },
            { setting_key: "pms_webhook_secret", setting_value: config.pms_webhook_secret },
            { setting_key: "pms_inbound_api_key", setting_value: config.pms_inbound_api_key },
        ];
        const { error } = await supabase.from("hotel_settings").upsert(upserts, { onConflict: "setting_key" });
        setSaveMessage(error ? "❌ Failed to save. Please try again." : "✅ Configuration saved successfully!");
        setIsSaving(false);
        setTimeout(() => setSaveMessage(""), 4000);
    };

    const handleTestConnection = async () => {
        setIsTesting(true);
        setTestResult(null);
        const res = await fetch("/api/admin/pms-test", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ provider: config.pms_provider, api_key: config.pms_api_key, base_url: config.pms_base_url }),
        });
        setTestResult(await res.json());
        setIsTesting(false);
    };

    const handleManualSync = async () => {
        setIsSyncing(true);
        setSyncResult(null);
        try {
            const res = await fetch("/api/pms/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-pms-api-key": config.pms_inbound_api_key },
            });
            const data = await res.json();
            setSyncResult(res.ok
                ? `✅ Sync complete — Bookings: ${data.results?.bookings}, Reservations: ${data.results?.reservations}, Inquiries: ${data.results?.inquiries}`
                : `❌ Sync failed: ${data.error}`
            );
        } catch {
            setSyncResult("❌ Sync failed — check your connection and API key.");
        }
        setIsSyncing(false);
        setTimeout(() => setSyncResult(null), 8000);
    };

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    if (isLoading) return <div className={styles.loadingState}>Loading PMS configuration...</div>;

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <div className={styles.titleArea}>
                    <Plug size={28} className={styles.headerIcon} />
                    <div>
                        <h1>PMS Configuration</h1>
                        <p>Connect your Property Management System — no code required. Configure once, sync forever.</p>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                {/* Enable Toggle */}
                <div className={styles.card}>
                    <div className={styles.enableRow}>
                        <div>
                            <h3>PMS Integration</h3>
                            <p>Enable to start syncing booking and reservation events to your PMS.</p>
                            {config.pms_last_sync && (
                                <p style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>
                                    Last sync: {new Date(config.pms_last_sync).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                                </p>
                            )}
                        </div>
                        <label className={styles.toggle}>
                            <input type="checkbox" checked={config.pms_enabled} onChange={(e) => setConfig({ ...config, pms_enabled: e.target.checked })} />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                </div>

                {/* Provider Card */}
                <div className={styles.card}>
                    <h3>Provider Settings</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>PMS Software Provider</label>
                            <select value={config.pms_provider} onChange={(e) => setConfig({ ...config, pms_provider: e.target.value })}>
                                {PMS_PROVIDERS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>PMS Base API URL <span className={styles.hint}>(optional for preset providers)</span></label>
                            <input type="url" placeholder="https://api.yourpms.com/v1" value={config.pms_base_url}
                                onChange={(e) => setConfig({ ...config, pms_base_url: e.target.value })} />
                        </div>

                        {config.pms_provider && PROVIDER_DOCS[config.pms_provider] && (
                            <div className={styles.docsBadge}>
                                <AlertTriangle size={14} />
                                Get your API credentials from the{" "}
                                <a href={PROVIDER_DOCS[config.pms_provider]} target="_blank" rel="noopener noreferrer">
                                    {PMS_PROVIDERS.find(p => p.value === config.pms_provider)?.label} Docs ↗
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* PMS API Credentials */}
                <div className={styles.card}>
                    <h3>PMS API Credentials</h3>
                    <p className={styles.cardSubtitle}>Credentials to authenticate with your PMS software (outbound — website calls PMS).</p>
                    <div className={styles.formGrid}>
                        {[
                            { label: "API Key", key: "pms_api_key", showKey: "apiKey", placeholder: "Enter your PMS API key" },
                            { label: "API Secret", key: "pms_api_secret", showKey: "apiSecret", placeholder: "Enter API secret (optional)" },
                        ].map(({ label, key, showKey, placeholder }) => (
                            <div className={styles.formGroup} key={key}>
                                <label>{label}</label>
                                <div className={styles.secretInput}>
                                    <input
                                        type={show[showKey as keyof typeof show] ? "text" : "password"}
                                        placeholder={placeholder}
                                        value={config[key as keyof typeof config] as string}
                                        onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                                    />
                                    <button type="button" onClick={() => setShow({ ...show, [showKey]: !show[showKey as keyof typeof show] })}>
                                        {show[showKey as keyof typeof show] ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gateway Configuration */}
                <div className={styles.card}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                        <Zap size={20} style={{ color: "var(--primary-color)" }} />
                        <h3 style={{ margin: 0 }}>Gateway Configuration</h3>
                    </div>
                    <p className={styles.cardSubtitle}>
                        Configure the bidirectional data sync between this website and <strong>Geny PMS</strong>.
                        Fill these in when you&apos;re ready to connect — no code changes needed.
                    </p>

                    <div className={styles.formGrid}>
                        {/* Outbound section */}
                        <p style={{ margin: "0 0 4px", fontSize: "12px", fontWeight: 700, color: "var(--primary-color)", textTransform: "uppercase", letterSpacing: "1px" }}>
                            📤 Outbound — Website → Geny PMS
                        </p>

                        <div className={styles.formGroup}>
                            <label>
                                <Globe size={14} style={{ display: "inline", marginRight: "6px" }} />
                                Webhook URL
                            </label>
                            <input type="url" placeholder="https://your-geny-pms.com/webhooks/hotel"
                                value={config.pms_webhook_url} onChange={(e) => setConfig({ ...config, pms_webhook_url: e.target.value })} />
                            <span className={styles.hint}>Geny PMS will receive booking/reservation events here as signed JSON POST requests.</span>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Webhook Secret <span className={styles.hint}>(for HMAC-SHA256 signature verification)</span></label>
                            <div className={styles.secretInput}>
                                <input type={show.webhookSecret ? "text" : "password"} placeholder="Enter webhook secret"
                                    value={config.pms_webhook_secret} onChange={(e) => setConfig({ ...config, pms_webhook_secret: e.target.value })} />
                                <button type="button" onClick={() => setShow({ ...show, webhookSecret: !show.webhookSecret })}>
                                    {show.webhookSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Inbound section */}
                        <p style={{ margin: "8px 0 4px", fontSize: "12px", fontWeight: 700, color: "var(--primary-color)", textTransform: "uppercase", letterSpacing: "1px" }}>
                            📥 Inbound — Geny PMS → Website (Pull API)
                        </p>

                        <div className={styles.formGroup}>
                            <label>
                                <Key size={14} style={{ display: "inline", marginRight: "6px" }} />
                                Inbound API Key
                            </label>
                            <div className={styles.secretInput}>
                                <input type={show.inboundKey ? "text" : "password"} placeholder="Set a strong secret key"
                                    value={config.pms_inbound_api_key} onChange={(e) => setConfig({ ...config, pms_inbound_api_key: e.target.value })} />
                                <button type="button" onClick={() => setShow({ ...show, inboundKey: !show.inboundKey })}>
                                    {show.inboundKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <span className={styles.hint}>Geny PMS sends this in the <code>X-PMS-API-Key</code> header to authenticate.</span>
                        </div>

                        {/* API Endpoints Info */}
                        <div className={styles.docsBadge} style={{ flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
                            <p style={{ margin: 0, fontWeight: 700 }}>📡 Geny PMS Pull API Endpoints (share with your PMS developer):</p>
                            <code>{baseUrl}/api/pms/bookings</code>
                            <code>{baseUrl}/api/pms/reservations</code>
                            <code>{baseUrl}/api/pms/inquiries</code>
                            <code>{baseUrl}/api/pms/rooms</code>
                            <code>{baseUrl}/api/pms/sync <span style={{ color: "#888" }}>(POST — triggers full push)</span></code>
                        </div>
                    </div>
                </div>

                {/* Test & Sync Results */}
                {testResult && (
                    <div className={`${styles.testResult} ${testResult.success ? styles.testSuccess : styles.testError}`}>
                        {testResult.success ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        <span>{testResult.message}</span>
                    </div>
                )}
                {syncResult && (
                    <div className={`${styles.testResult} ${syncResult.startsWith("✅") ? styles.testSuccess : styles.testError}`}>
                        <Zap size={20} />
                        <span>{syncResult}</span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className={styles.actions}>
                    <button onClick={handleTestConnection} disabled={isTesting || !config.pms_api_key || !config.pms_provider} className={styles.testBtn}>
                        <RefreshCw size={18} className={isTesting ? styles.spinning : ""} />
                        {isTesting ? "Testing..." : "Test PMS Connection"}
                    </button>
                    <button onClick={handleManualSync} disabled={isSyncing || !config.pms_inbound_api_key} className={styles.testBtn}
                        title="Manually push all pending bookings to PMS">
                        <Zap size={18} className={isSyncing ? styles.spinning : ""} />
                        {isSyncing ? "Syncing..." : "Sync All Now"}
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className={styles.saveBtn}>
                        <Save size={18} />
                        {isSaving ? "Saving..." : "Save Configuration"}
                    </button>
                </div>

                {saveMessage && <p className={styles.saveMessage}>{saveMessage}</p>}
            </div>
        </div>
    );
}
