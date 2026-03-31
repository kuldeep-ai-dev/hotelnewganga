import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, Calendar, User } from "lucide-react";
import MotionReveal from "@/components/MotionReveal";
import TranslateButton from "@/components/TranslateButton";
import LeadMagnetForm from "@/components/LeadMagnetForm";
import styles from "./slug.module.css";
import type { Metadata } from 'next';

interface Params {
    params: { slug: string };
}

export const revalidate = 60; // Auto-regenerate cache every 60 seconds

// Ultimate SEO Integration: Dynamically injects Meta Title & Desc from DB!
export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const { data: post } = await supabase
        .from("blog_posts")
        .select("title, excerpt, meta_title, meta_description, keywords, featured_image_url")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (!post) {
        return {
            title: "Article Not Found | Hotel New Ganga",
        };
    }

    return {
        title: post.meta_title || `${post.title} | Hotel New Ganga GS Road`,
        description: post.meta_description || post.excerpt,
        keywords: post.keywords,
        openGraph: {
            title: post.meta_title || post.title,
            description: post.meta_description || post.excerpt,
            images: post.featured_image_url ? [post.featured_image_url] : [],
            type: "article",
        }
    };
}

async function getPost(slug: string) {
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
    
    if (error || !data) return null;
    return data;
}

export default async function BlogPostPage({ params }: Params) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <main className={styles.main}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `https://www.hotelnewganga.in/blog/${post.slug}`
                        },
                        "headline": post.title,
                        "description": post.excerpt || post.meta_description,
                        "image": post.featured_image_url || "https://www.hotelnewganga.in/images/hng-logo.jpg",
                        "author": {
                            "@type": "Organization",
                            "name": post.author || "Hotel New Ganga",
                            "url": "https://www.hotelnewganga.in"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Hotel New Ganga",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://www.hotelnewganga.in/images/hng-logo.jpg"
                            }
                        },
                        "datePublished": post.created_at,
                        "dateModified": post.updated_at || post.created_at
                    })
                }}
            />
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
                                "name": "Blog Journal",
                                "item": "https://www.hotelnewganga.in/blog"
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": post.title,
                                "item": `https://www.hotelnewganga.in/blog/${post.slug}`
                            }
                        ]
                    })
                }}
            />
            {/* Immersive Parallax Header */}
            <header className={styles.hero}>
                <Image 
                    src={post.featured_image_url || "/images/hotel/reception.jpg"}
                    alt={post.title}
                    fill
                    sizes="100vw"
                    priority
                    className={styles.heroImage}
                />
                <div className={styles.heroContent}>
                    <MotionReveal direction="up" delay={0.1}>
                        <h1>{post.title}</h1>
                        <div className={styles.meta}>
                            <span className={styles.metaItem}>
                                <Calendar size={18} /> 
                                {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className={styles.metaItem}>
                                <User size={18} /> {post.author}
                            </span>
                        </div>
                    </MotionReveal>
                </div>
            </header>

            {/* Readability Focused Content Container */}
            <article className={styles.articleContainer}>
                <MotionReveal direction="up" delay={0.3}>
                    {/* Render raw string HTML securely generated from ReactQuill */}
                    <TranslateButton />
                    <div 
                        className={styles.contentWrapper}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <MotionReveal direction="up" delay={0.2}>
                        <LeadMagnetForm />
                    </MotionReveal>
                    
                    <footer className={styles.footerActions}>
                        <Link href="/blog" className={styles.backLink}>
                            <ArrowLeft size={18} /> Back to Insights
                        </Link>
                        {/* We use standard HTML here; a client component could execute native share API later */}
                        <button className={styles.shareBtn} title="Share Article">
                            <Share2 size={18} /> Share Article
                        </button>
                    </footer>
                </MotionReveal>
            </article>
        </main>
    );
}
