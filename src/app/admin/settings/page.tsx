import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import styles from "./page.module.css";
import { Server, KeyRound, Globe, Save, MessageCircle, Mail } from "lucide-react";

async function getSettings() {
    // Fetch specifically the Google keys from the site_content table
    const { data, error } = await supabase
        .from("site_content")
        .select("content_key, content_value")
        .in("content_key", ["google_places_api_key", "google_places_place_id", "whatsapp_number", "admin_notification_email"]);

    const settings = { apiKey: "", placeId: "", whatsappNumber: "", notificationEmail: "" };
    
    if (data) {
        data.forEach((item) => {
            if (item.content_key === "google_places_api_key") settings.apiKey = item.content_value;
            if (item.content_key === "google_places_place_id") settings.placeId = item.content_value;
            if (item.content_key === "whatsapp_number") settings.whatsappNumber = item.content_value;
            if (item.content_key === "admin_notification_email") settings.notificationEmail = item.content_value;
        });
    }

    return settings;
}

export default async function SettingsAdminPage() {
    const settings = await getSettings();

    async function updateSettings(formData: FormData) {
        "use server";
        const apiKey = formData.get("apiKey")?.toString().trim();
        const placeId = formData.get("placeId")?.toString().trim();
        const whatsappNumber = formData.get("whatsappNumber")?.toString().trim();
        const notificationEmail = formData.get("notificationEmail")?.toString().trim();

        const updates = [];

        if (apiKey !== undefined) {
            updates.push({ content_key: "google_places_api_key", content_value: apiKey });
        }
        
        if (placeId !== undefined) {
            updates.push({ content_key: "google_places_place_id", content_value: placeId });
        }
        
        if (whatsappNumber !== undefined) {
            updates.push({ content_key: "whatsapp_number", content_value: whatsappNumber });
        }
        
        if (notificationEmail !== undefined) {
            updates.push({ content_key: "admin_notification_email", content_value: notificationEmail });
        }

        if (updates.length > 0) {
            // Initiate Service Role Client natively bypassing RLS for safe Admin settings insertions
            const { createClient } = await import("@supabase/supabase-js");
            const adminSupabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );
            
            const { error: upsertError } = await adminSupabase.from("site_content").upsert(updates, { onConflict: "content_key" });
            
            if (upsertError) {
                console.error("Failed to update setting:", upsertError);
                throw new Error(`Database Rejection: ${upsertError.message} (Code: ${upsertError.code})`);
            }
        }

        revalidatePath("/");
        revalidatePath("/admin/settings");
    }

    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <Server size={32} className={styles.iconPrimary} />
                    <div className={styles.titleContent}>
                        <h1>System & Integration Settings</h1>
                        <p>Manage API integrations, secure keys, and server-side configurations perfectly integrated throughout your application.</p>
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                {/* Google Integrations Card */}
                <div className={styles.settingsCard}>
                    <div className={styles.cardHeader}>
                        <Globe size={20} className={styles.iconSecondary} />
                        <h2>Google Places Integration</h2>
                    </div>
                    
                    <p className={styles.cardDesc}>
                        Enable the live Guest Reviews module on your homepage by providing your official Google Cloud API Key and your Public Place ID. 
                        Once saved, mock data will automatically switch to your authentic live reviews securely.
                    </p>

                    <form action={updateSettings} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="apiKey">
                                <KeyRound size={16} /> Google Places API Key
                            </label>
                            <input
                                type="password"
                                id="apiKey"
                                name="apiKey"
                                defaultValue={settings.apiKey}
                                placeholder="AIzaSy...Your-Encrypted-Key-Here"
                                className={styles.input}
                            />
                            <span className={styles.helperText}>Requires Places API explicitly enabled in Google Cloud Console.</span>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="placeId">
                                <Globe size={16} /> Google Place ID (Public)
                            </label>
                            <input
                                type="text"
                                id="placeId"
                                name="placeId"
                                defaultValue={settings.placeId}
                                placeholder="ChIJ...Your-Place-ID"
                                className={styles.input}
                            />
                            <span className={styles.helperText}>Public string associating your physical hotel to Maps.</span>
                        </div>

                        <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                            <Save size={18} /> Save Integrations
                        </button>
                    </form>
                </div>
                
                
                {/* Marketing Integrations Card */}
                <div className={styles.settingsCard}>
                    <div className={styles.cardHeader}>
                        <MessageCircle size={20} className={styles.iconSecondary} style={{color: '#25D366'}}/>
                        <h2>WhatsApp Marketing Lead Float</h2>
                    </div>
                    <p className={styles.cardDesc}>
                        Configuring a number here automatically injects the WhatsApp chat widget into the corner of the entire public site. 
                        Guest conversations will bypass phone calls directly to this specific number.
                    </p>

                    <form action={updateSettings} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="whatsappNumber">
                                <MessageCircle size={16} /> Business WhatsApp Number
                            </label>
                            <input
                                type="text"
                                id="whatsappNumber"
                                name="whatsappNumber"
                                defaultValue={settings.whatsappNumber}
                                placeholder="919876543210 (Include Country Code)"
                                className={styles.input}
                            />
                            <span className={styles.helperText}>Must strictly start with country code without '+'. Example for India: 91xxxxxxxxx</span>
                        </div>

                        <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                            <Save size={18} /> Deploy WhatsApp Module
                        </button>
                    </form>
                </div>

                {/* Email Notification Routing Card */}
                <div className={styles.settingsCard}>
                    <div className={styles.cardHeader}>
                        <Mail size={20} className={styles.iconSecondary} style={{color: '#ea4335'}}/>
                        <h2>Email Notification Routing</h2>
                    </div>
                    <p className={styles.cardDesc}>
                        Define exactly who receives the automated "New Booking" and "New Corporate Inquiry" emails. 
                        You can add multiple email addresses separated by a comma. If left blank, it defaults to the master environment email.
                    </p>

                    <form action={updateSettings} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="notificationEmail">
                                <Mail size={16} /> Internal Notification Addresses
                            </label>
                            <input
                                type="text"
                                id="notificationEmail"
                                name="notificationEmail"
                                defaultValue={settings.notificationEmail}
                                placeholder="manager@hotel.com, desk@hotel.com"
                                className={styles.input}
                            />
                            <span className={styles.helperText}>Separate multiple emails with commas.</span>
                        </div>

                        <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                            <Save size={18} /> Update Email Routing
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
