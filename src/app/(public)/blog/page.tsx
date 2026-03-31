import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";
import { ArrowRight } from "lucide-react";
import styles from "./page.module.css";
import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
    return await getSeoMetadata("/blog");
}

export const revalidate = 60; // Auto-regenerate cache every 60 seconds

async function getPublishedBlogs() {
    const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, featured_image_url, created_at, is_published")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
    return data || [];
}

export default async function BlogIndexPage() {
    const blogs = await getPublishedBlogs();

    return (
        <main className={styles.main}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://www.hotelnewganga.in"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Hotel Insights & Local Guides",
                                "item": "https://www.hotelnewganga.in/blog"
                            }
                        ]
                    })
                }}
            />
            <section className={styles.hero}>
                <div className={styles.container}>
                    <MotionReveal direction="up" delay={0.1}>
                        <h1>Hotel New Ganga Insights</h1>
                        <p>Discover local guides to Guwahati, healthcare transit tips close to Nemcare Hospital, and luxury hotel highlights.</p>
                    </MotionReveal>
                </div>
            </section>

            <section className={styles.gridSection}>
                <div className={styles.container}>
                    {blogs.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h3>Our Journal is brewing...</h3>
                            <p>Check back shortly for premium content and local guides to navigating Guwahati!</p>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {blogs.map((blog, idx) => (
                                <MotionReveal key={blog.id} direction="up" delay={0.1 * (idx % 3)}>
                                    <Link href={`/blog/${blog.slug}`} className={styles.card}>
                                        <div className={styles.imageWrapper}>
                                            <Image 
                                                src={blog.featured_image_url || "/images/hotel/SUPER%20DELUXE/IMG20241223165936.jpg"} 
                                                alt={blog.title} 
                                                fill 
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className={styles.image} 
                                            />
                                        </div>
                                        <div className={styles.content}>
                                            <div className={styles.meta}>
                                                {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <h2>{blog.title}</h2>
                                            <p className={styles.excerpt}>{blog.excerpt || "Read our exclusive deep-dive on this topic inside..."}</p>
                                            <span className={styles.readMore}>
                                                Full Guide <ArrowRight size={16} />
                                            </span>
                                        </div>
                                    </Link>
                                </MotionReveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
