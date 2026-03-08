"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, RefreshCw } from "lucide-react";
import styles from "./page.module.css";

export default function SEOAdmin() {
    const [seoData, setSeoData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        fetchSeoData();
    }, []);

    const fetchSeoData = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("seo_metadata")
            .select("*")
            .order("page_path", { ascending: true });

        if (!error && data) {
            setSeoData(data);
        }
        setLoading(false);
    };

    const handleUpdate = (id: string, field: string, value: string) => {
        setSeoData(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const saveSeo = async (item: any) => {
        setSaving(item.id);
        const { error } = await supabase
            .from("seo_metadata")
            .update({
                meta_title: item.meta_title,
                meta_description: item.meta_description,
                keywords: item.keywords,
                updated_at: new Date().toISOString()
            })
            .eq("id", item.id);

        if (!error) {
            alert(`SEO updated for ${item.page_path}`);
        } else {
            alert("Failed to update SEO");
        }
        setSaving(null);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <h1>SEO Management</h1>
                    <button onClick={fetchSeoData} className={`btn btn-outline ${styles.refreshBtn}`}>
                        <RefreshCw size={16} />Refresh
                    </button>
                </div>
                <p>Control meta tags, titles, and descriptions dynamically for top search engine ranking.</p>
            </header>

            {loading ? (
                <div className={styles.loading}>Loading SEO Data...</div>
            ) : (
                <div className={styles.seoList}>
                    {seoData.map((item) => (
                        <div key={item.id} className={styles.seoCard}>
                            <div className={styles.cardHeader}>
                                <h3>{item.page_path === "/" ? "Home Page (/)" : item.page_path}</h3>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Meta Title</label>
                                <input
                                    type="text"
                                    value={item.meta_title}
                                    onChange={(e) => handleUpdate(item.id, "meta_title", e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Meta Description</label>
                                <textarea
                                    rows={3}
                                    value={item.meta_description}
                                    onChange={(e) => handleUpdate(item.id, "meta_description", e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Keywords (comma separated)</label>
                                <input
                                    type="text"
                                    value={item.keywords || ""}
                                    onChange={(e) => handleUpdate(item.id, "keywords", e.target.value)}
                                    placeholder="hotel, guwahati, best room..."
                                />
                            </div>

                            <div className={styles.cardFooter}>
                                <span className={styles.updatedAt}>
                                    Last updated: {new Date(item.updated_at).toLocaleString()}
                                </span>
                                <button
                                    onClick={() => saveSeo(item)}
                                    className={`btn btn-primary ${styles.saveBtn}`}
                                    disabled={saving === item.id}
                                >
                                    <Save size={18} />
                                    {saving === item.id ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
