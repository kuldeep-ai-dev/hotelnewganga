import { supabase } from "./supabase";
import type { Metadata } from "next";

export async function getSeoMetadata(path: string): Promise<Metadata> {
    // Default fallback metadata
    const fallback = {
        title: "Hotel New Ganga | Premium Stays in Guwahati",
        description: "Experience premium stays, top-notch medical transit convenience, and fine dining at Hotel New Ganga, G.S. Road, Guwahati.",
    };

    try {
        const { data, error } = await supabase
            .from("seo_metadata")
            .select("*")
            .eq("page_path", path)
            .single();

        if (!error && data) {
            return {
                title: data.meta_title,
                description: data.meta_description,
                keywords: data.keywords,
            };
        }
    } catch (err) {
        console.error("Failed to fetch SEO for path:", path);
    }

    return fallback;
}
