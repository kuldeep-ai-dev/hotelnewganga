"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FileEdit, Trash2, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

// Interface map mirroring Supabase setup
interface BlogPost {
    id: string;
    title: string;
    slug: string;
    is_published: boolean;
    created_at: string;
}

export default function BlogsAdmin() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("blog_posts")
            .select("id, title, slug, is_published, created_at")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setBlogs(data);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you absolutely sure you want to permanently delete '${title}'?`)) return;

        const { error } = await supabase.from("blog_posts").delete().eq("id", id);
        if (!error) {
            setBlogs((prev) => prev.filter((b) => b.id !== id));
        } else {
            alert("Error deleting post.");
            console.error(error);
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <div>
                    <h1>Blog System</h1>
                    <p>Manage high-performing SEO articles and hotel news locally.</p>
                </div>
                <Link href="/admin/blogs/new" className={styles.createBtn}>
                    <Plus size={20} /> Create New Post
                </Link>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Blog Title & Slug</th>
                            <th>Status</th>
                            <th>Publish Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: "center", padding: "40px" }}>Loading blogs database...</td>
                            </tr>
                        ) : blogs.length === 0 ? (
                            <tr>
                                <td colSpan={4}>
                                    <div className={styles.emptyState}>
                                        <p>No blog posts found. Start dominating SEO by writing your first guide!</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            blogs.map((post) => (
                                <tr key={post.id} className={styles.row}>
                                    <td className={styles.titleCol}>
                                        <strong>{post.title}</strong>
                                        <span>/{post.slug}</span>
                                    </td>
                                    <td>
                                        <span className={post.is_published ? styles.statusPub : styles.statusDraft}>
                                            {post.is_published ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td>{new Date(post.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Link href={`/admin/blogs/edit/${post.id}`} className={styles.editBtn} title="Edit Post">
                                                <FileEdit size={18} />
                                            </Link>
                                            {post.is_published && (
                                                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className={styles.editBtn} style={{backgroundColor: '#f3e8ff', color: '#9333ea'}} title="View Live Post">
                                                    <ArrowUpRight size={18} />
                                                </a>
                                            )}
                                            <button onClick={() => handleDelete(post.id, post.title)} className={styles.deleteBtn} title="Delete Post">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
