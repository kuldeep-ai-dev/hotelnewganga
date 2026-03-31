"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";
import { Save, Activity, Globe, Type, Link as LinkIcon, Image as ImageIcon, Search } from "lucide-react";
import styles from "./editor.module.css";
import "react-quill-new/dist/quill.snow.css"; // Importer Quill styles

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false, loading: () => <p>Loading Advanced Editor...</p> });

interface BlogEditorProps {
    postId?: string; // If undefined, it's a new post
}

export default function BlogEditor({ postId }: BlogEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(postId ? true : false);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [headerImage, setHeaderImage] = useState("");
    
    // SEO
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDesc, setMetaDesc] = useState("");
    const [keywords, setKeywords] = useState("");

    useEffect(() => {
        if (postId) {
            loadPost();
        }
    }, [postId]);

    const loadPost = async () => {
        const { data, error } = await supabase.from("blog_posts").select("*").eq("id", postId).single();
        if (data) {
            setTitle(data.title);
            setSlug(data.slug);
            setExcerpt(data.excerpt || "");
            setContent(data.content || "");
            setHeaderImage(data.featured_image_url || "");
            setMetaTitle(data.meta_title || "");
            setMetaDesc(data.meta_description || "");
            setKeywords(data.keywords || "");
        }
        setLoading(false);
    };

    const autoGenerateSlug = (text: string) => {
        if (postId) return; // Don't auto-override slugs on existing posts
        const generated = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setSlug(generated);
    };

    const handleSave = async (publishStatus: boolean) => {
        if (!title || !slug || !content) {
            alert("Title, Slug, and Content are strictly required.");
            return;
        }

        setSaving(true);
        const postData = {
            title,
            slug,
            excerpt,
            content,
            featured_image_url: headerImage,
            meta_title: metaTitle,
            meta_description: metaDesc,
            keywords,
            is_published: publishStatus,
            updated_at: new Date().toISOString()
        };

        let err;
        if (postId) {
            const { error } = await supabase.from("blog_posts").update(postData).eq("id", postId);
            err = error;
        } else {
            const { error } = await supabase.from("blog_posts").insert(postData);
            err = error;
        }

        setSaving(false);
        if (err) {
            console.error(err);
            alert("Database Error: " + err.message);
        } else {
            router.push("/admin/blogs");
        }
    };

    if (loading) return <div>Loading supercharged editor...</div>;

    const quillModules = {
        toolbar: [
            [{ 'header': [2, 3, 4, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'blockquote'],
            ['clean']
        ],
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>{postId ? "Edit Luxury Blog Post" : "Draft New Blog Post"}</h1>
            </div>

            <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                    <label><Type size={16}/> Article Title</label>
                    <input 
                        type="text" 
                        className={styles.input} 
                        value={title} 
                        onChange={(e) => {
                            setTitle(e.target.value);
                            autoGenerateSlug(e.target.value);
                        }}
                        placeholder="e.g. 5 Reasons to Stay Near Nemcare Hospital Guwahati"
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label><LinkIcon size={16}/> URL Slug (The Link)</label>
                        <input type="text" className={styles.input} value={slug} onChange={(e) => setSlug(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label><ImageIcon size={16}/> Featured Image URL</label>
                        <input type="text" className={styles.input} value={headerImage} onChange={(e) => setHeaderImage(e.target.value)} placeholder="/images/hotel/reception.jpg" />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Short Excerpt (For the Blog Grid)</label>
                    <textarea className={styles.textarea} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} maxLength={250} placeholder="A short 2 sentence hook designed to make people click read more..." />
                </div>

                <div className={styles.inputGroup}>
                    <label>Main Content Engine</label>
                    <div className={styles.quillWrapper}>
                        <ReactQuill 
                            theme="snow" 
                            value={content} 
                            onChange={setContent} 
                            modules={quillModules}
                        />
                    </div>
                </div>

                {/* Ultimate SEO Engine block */}
                <div className={styles.seoSection}>
                    <h3><Search size={20}/> Deep SEO Overrides</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Meta Title (Overrides the standard Title for Google)</label>
                            <input type="text" className={styles.input} value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Keep under 60 characters..." />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Meta Description</label>
                            <textarea className={styles.textarea} value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} placeholder="Keep under 160 characters..." style={{minHeight: '80px'}}/>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Target Keywords (comma separated)</label>
                            <input type="text" className={styles.input} value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="hotels near nemcare, guwahati rooms, etc" />
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.btnCancel} onClick={() => router.push("/admin/blogs")} disabled={saving}>Cancel</button>
                    <button className={styles.btnDraft} onClick={() => handleSave(false)} disabled={saving}><Save size={18}/> Save as Draft</button>
                    <button className={styles.btnPublish} onClick={() => handleSave(true)} disabled={saving}><Globe size={18}/> {saving ? "Broadcasting..." : "Publish Live"}</button>
                </div>
            </div>
        </div>
    );
}
