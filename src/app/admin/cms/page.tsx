"use client";

import { useState, useEffect } from "react";
import { Save, Image as ImageIcon, Loader2, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

interface ContentItem {
    id: string;
    content_key: string;
    content_value: string;
    content_type: string;
    description: string;
}

export default function CMSManagement() {
    const [content, setContent] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [successId, setSuccessId] = useState<string | null>(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("site_content")
            .select("*")
            .order("content_key", { ascending: true });

        if (!error && data) {
            setContent(data);
        }
        setLoading(false);
    };

    const handleUpdate = async (id: string, value: string) => {
        setSavingId(id);
        const { error } = await supabase
            .from("site_content")
            .update({ content_value: value })
            .eq("id", id);

        if (error) {
            alert(error.message);
        } else {
            setSuccessId(id);
            setTimeout(() => setSuccessId(null), 3000);
        }
        setSavingId(null);
    };

    const handleChange = (id: string, value: string) => {
        setContent(prev => prev.map(item =>
            item.id === id ? { ...item, content_value: value } : item
        ));
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '100px 0', justifyContent: 'center' }}>
                    <Loader2 className="animate-spin" />
                    <p>Loading site content...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Site CMS</h1>
                <p>Manage banners, hero sections, and gallery photos without coding.</p>
            </div>

            <div className={styles.grid}>
                {content.map((item) => (
                    <div key={item.id} className={styles.contentCard}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h3>{item.description}</h3>
                                <code style={{ fontSize: '0.7rem', color: '#888' }}>{item.content_key}</code>
                            </div>
                            <span className={styles.typeBadge}>{item.content_type}</span>
                        </div>

                        {item.content_type === 'image' && (
                            <div className={styles.previewArea}>
                                {item.content_value ? (
                                    <img src={item.content_value} alt="Preview" className={styles.previewImg} />
                                ) : (
                                    <div className={styles.noImage}>
                                        <ImageIcon size={32} />
                                        <span>No image URL provided</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className={styles.editArea}>
                            <div className={styles.inputGroup}>
                                <label>{item.content_type === 'image' ? "Image URL" : "Text Content"}</label>
                                <input
                                    className={styles.input}
                                    value={item.content_value}
                                    onChange={(e) => handleChange(item.id, e.target.value)}
                                    placeholder={`Enter new ${item.content_type} value...`}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button
                                    className={styles.saveBtn}
                                    onClick={() => handleUpdate(item.id, item.content_value)}
                                    disabled={savingId === item.id}
                                >
                                    {savingId === item.id ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    Save Changes
                                </button>
                                {successId === item.id && (
                                    <span className={styles.successMsg}>
                                        <Check size={16} /> Saved!
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
