import { Check, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import PromoBanner from "@/components/PromoBanner";
import { supabase } from "@/lib/supabase";
import { getSiteContent } from "@/lib/cms";
import { getSeoMetadata } from "@/lib/seo";
import { BreadcrumbSchema } from "@/components/JsonLdSchema";

export async function generateMetadata() {
    return await getSeoMetadata("/rooms");
}

export const revalidate = 0;

async function getRooms() {
    const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching rooms:", error);
        return [];
    }
    return data || [];
}

export default async function RoomsPage() {
    const rooms = await getRooms();
    const heroBg = "/images/hotel/dELUXE/IMG20241223164637.jpg";

    return (
        <main className={styles.main}>
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "https://www.hotelnewganga.in" },
                    { name: "Rooms & Suites", url: "https://www.hotelnewganga.in/rooms" },
                ]}
            />

            {/* Premium Hero */}
            <header className={styles.heroWrapper}>
                <div 
                    className={styles.heroImage}
                    style={{ backgroundImage: `url(${heroBg})` }}
                />
                <div className={styles.heroOverlay}>
                    <div className={styles.heroContent}>
                        <span className={`fade-in ${styles.eyebrow}`}>Accommodations</span>
                        <h1 className="fade-in">Rooms & Suites</h1>
                        <p className="fade-in">Experience unparalleled comfort and Assamese hospitality.</p>
                    </div>
                </div>
            </header>

            {/* SEO intro */}
            <section className={styles.seoIntro}>
                <p>
                    Discover our selection of well-appointed <strong>AC rooms in Guwahati</strong> featuring complimentary Wi-Fi, premium soundproofing, and modern amenities.
                    Strategically located on <strong>GS Road, Bhangagarh</strong>, we are the preferred choice for guests visiting Nemcare Hospital and GMCH.
                </p>
            </section>

            {/* Rooms List */}
            <section className={styles.roomsSection}>
                <div className={styles.container}>
                    {rooms.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <p>No rooms available at the moment. Please check back later.</p>
                        </div>
                    ) : (
                        rooms.map((room, index) => (
                            <div key={room.id} className={`${styles.roomCard} ${index % 2 !== 0 ? styles.reverse : ""}`}>
                                <div className={styles.imageCol}>
                                    <Image
                                        src={room.image_url || "/images/hotel/SUPER%20DELUXE/IMG20241223165936.jpg"}
                                        alt={`${room.name} — Affordable AC Hotel Room near Nemcare and GMCH Guwahati`}
                                        fill
                                        sizes="(max-width: 900px) 100vw, 50vw"
                                        className={styles.roomImg}
                                    />
                                </div>
                                <div className={styles.contentCol}>
                                    <div className={styles.roomHeader}>
                                        <h2>{room.name}</h2>
                                        <div className={styles.price}>
                                            <span className={styles.amount}>₹{room.price_starting}</span>
                                            <span className={styles.night}>/ night (excl. taxes)</span>
                                        </div>
                                    </div>

                                    <p className={styles.desc}>{room.description}</p>

                                    <div className={styles.amenities}>
                                        {room.amenities && room.amenities.map((feature: string) => (
                                            <div key={feature} className={styles.amenityItem}>
                                                <div className={styles.checkWrapper}>
                                                    <Check size={14} className={styles.checkIcon} />
                                                </div>
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link href={`/book?room=${room.id}`} className={styles.reserveLink}>
                                        Reserve This Room <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Beautiful Page Footer Links */}
            <section className={styles.pageFooter}>
                <div className={styles.footerLinksGrid}>
                    <Link href="/restaurant" className={styles.footerLinkCard}>
                        <span className={styles.cardEyebrow}>Explore</span>
                        <h3>Dining Experience</h3>
                        <ArrowRight className={styles.cardIcon} size={24} />
                    </Link>
                    <Link href="/location" className={styles.footerLinkCard}>
                        <span className={styles.cardEyebrow}>Navigate</span>
                        <h3>Location & Map</h3>
                        <ArrowRight className={styles.cardIcon} size={24} />
                    </Link>
                </div>
            </section>

            <PromoBanner />
        </main>
    );
}
