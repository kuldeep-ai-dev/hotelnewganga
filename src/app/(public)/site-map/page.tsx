import Link from "next/link";
import { BedDouble, Home, Utensils, Briefcase, MapPin, ArrowRightCircle, Shield, PhoneCall } from "lucide-react";
import styles from "./page.module.css";
import { getSeoMetadata } from "@/lib/seo";
import MotionReveal from "@/components/MotionReveal";

export async function generateMetadata() {
    return await getSeoMetadata("/site-map");
}

export default function SitemapPage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <span className={`fade-in ${styles.eyebrow}`}>Index</span>
                    <h1 className={`fade-in ${styles.title}`}>HTML Sitemap</h1>
                </header>

                <div className={styles.sitemapGrid}>
                    <MotionReveal direction="up" delay={0.1}>
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}><Home size={22} /> Main Pages</h2>
                            <ul className={styles.linkList}>
                                <li className={styles.linkItem}>
                                    <Link href="/"><ArrowRightCircle size={14} className={styles.iconSpacer}/> Home</Link>
                                </li>
                                <li className={styles.linkItem}>
                                    <Link href="/contact"><PhoneCall size={14} className={styles.iconSpacer}/> Contact Us</Link>
                                </li>
                                <li className={styles.linkItem}>
                                    <Link href="/book"><ArrowRightCircle size={14} className={styles.iconSpacer}/> Book Your Stay</Link>
                                </li>
                                <li className={styles.linkItem}>
                                    <Link href="/admin"><Shield size={14} className={styles.iconSpacer}/> Admin Portal</Link>
                                </li>
                            </ul>
                        </section>
                    </MotionReveal>

                    <MotionReveal direction="up" delay={0.2}>
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}><BedDouble size={22} /> Hotel Services</h2>
                            <ul className={styles.linkList}>
                                <li className={styles.linkItem}>
                                    <Link href="/rooms"><ArrowRightCircle size={14} className={styles.iconSpacer}/> Rooms & Suites</Link>
                                </li>
                                <li className={styles.linkItem}>
                                    <Link href="/restaurant"><Utensils size={14} className={styles.iconSpacer}/> Restaurant & Dining</Link>
                                </li>
                                <li className={styles.linkItem}>
                                    <Link href="/corporate"><Briefcase size={14} className={styles.iconSpacer}/> Corporate Stays</Link>
                                </li>
                                <li className={styles.linkItem}>
                                    <Link href="/location"><MapPin size={14} className={styles.iconSpacer}/> Location & Reach</Link>
                                </li>
                            </ul>
                        </section>
                    </MotionReveal>
                </div>
            </div>
        </main>
    );
}
