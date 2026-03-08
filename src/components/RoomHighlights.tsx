import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import styles from "./RoomHighlights.module.css";
import { supabase } from "@/lib/supabase";

async function getFeaturedRooms() {
    const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("display_order", { ascending: true })
        .limit(4);

    if (error) {
        console.error("Error fetching rooms for home page:", error);
        return [];
    }
    return data || [];
}

// Fallback static rooms in case DB is empty
const FALLBACK_ROOMS = [
    {
        id: "fallback-1",
        name: "Deluxe Room",
        description: "Perfect for solo travelers and budget-focused couples. Features a comfortable double bed and city views.",
        image_url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
        amenities: ["Free Wi-Fi", "Kettle"],
        price_starting: null,
    },
    {
        id: "fallback-2",
        name: "Superior Room",
        description: "Ideal for business travelers and medical reps. Enjoy premium bedding and a dedicated laptop-friendly workspace.",
        image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        amenities: ["Free Wi-Fi", "Breakfast"],
        price_starting: null,
    },
];

export default async function RoomHighlights() {
    const dbRooms = await getFeaturedRooms();
    const rooms = dbRooms.length > 0 ? dbRooms : FALLBACK_ROOMS;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Premium Accommodation</h2>
                    <p>Designed for comfort, our rooms are perfect for medical transit, corporate stays, and families. Soundproofed and meticulously sanitized.</p>
                </div>

                <div className={styles.grid}>
                    {rooms.map((room) => (
                        <div key={room.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={room.image_url || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80"}
                                    alt={room.name}
                                    fill
                                    className={styles.img}
                                />
                            </div>
                            <div className={styles.content}>
                                <h3>{room.name}</h3>
                                <p>{room.description}</p>
                                {room.price_starting && (
                                    <p className={styles.price}>
                                        Starting from <strong>₹{room.price_starting}</strong> / night
                                    </p>
                                )}
                                {room.amenities && room.amenities.length > 0 && (
                                    <div className={styles.amenities}>
                                        {room.amenities.slice(0, 3).map((amenity: string) => (
                                            <span key={amenity}>{amenity}</span>
                                        ))}
                                    </div>
                                )}
                                <Link href="/rooms" className={styles.link}>
                                    Explore <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Feature Banner */}
                <div className={styles.banner}>
                    <div className={styles.bannerContent}>
                        <MapPin size={48} className={styles.bannerIcon} />
                        <h3>Your Comfort Near Medical Hubs</h3>
                        <p>We are just a <strong>5-minute walk (0.3 km)</strong> from Nemcare Super Speciality Hospital and 0.6 km from GMCH.</p>
                        <Link href="/location" className={`btn btn-outline ${styles.bannerBtn}`}>
                            View Location Guide
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
