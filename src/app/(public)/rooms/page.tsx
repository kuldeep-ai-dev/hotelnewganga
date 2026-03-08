import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import PromoBanner from "@/components/PromoBanner";
import { supabase } from "@/lib/supabase";
import { getSiteContent } from "@/lib/cms";

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
    const heroBg = await getSiteContent("rooms_banner", "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80");

    return (
        <main className={styles.main}>
            {/* Hero Section */}
            <section
                className={styles.hero}
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBg})` }}
            >
                <div className={styles.heroContent}>
                    <h1 className="fade-in">Rooms & Suites</h1>
                    <p className="fade-in">Find the perfect room for your medical transit, business trip, or family stay.</p>
                </div>
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
                                        src={room.image_url || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80"}
                                        alt={room.name}
                                        fill
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
                                                <Check size={16} className={styles.checkIcon} />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <Link href={`/book?room=${room.id}`} className={`btn btn-primary ${styles.bookBtn}`}>
                                        Reserve Now
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* CTA Promo Banner */}
            <PromoBanner />

        </main>
    );
}
