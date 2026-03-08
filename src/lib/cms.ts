import { supabase } from "./supabase";

/**
 * Fetches site content by key from the site_content table.
 * Returns the content_value or a provided default.
 */
export async function getSiteContent(key: string, defaultValue: string = ""): Promise<string> {
    try {
        const { data, error } = await supabase
            .from("site_content")
            .select("content_value")
            .eq("content_key", key)
            .single();

        if (error || !data) {
            console.warn(`CMS: Key "${key}" not found, using default.`);
            return defaultValue;
        }

        return data.content_value;
    } catch (err) {
        console.error(`CMS Error fetching key "${key}":`, err);
        return defaultValue;
    }
}

/**
 * Fetches multiple site content keys in one request.
 */
export async function getMultipleSiteContent(keys: string[]): Promise<Record<string, string>> {
    try {
        const { data, error } = await supabase
            .from("site_content")
            .select("content_key, content_value")
            .in("content_key", keys);

        if (error || !data) return {};

        return data.reduce((acc, item) => {
            acc[item.content_key] = item.content_value;
            return acc;
        }, {} as Record<string, string>);
    } catch (err) {
        console.error("CMS Error fetching multiple keys:", err);
        return {};
    }
}
