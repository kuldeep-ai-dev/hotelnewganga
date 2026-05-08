import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BreadcrumbSchema } from "@/components/JsonLdSchema";
import styles from "./gallery.module.css";

export const revalidate = 0;

// Maps room name keywords → image folder slug and list of filenames
function getRoomGalleryConfig(roomName: string): { folder: string; images: string[] } | null {
    const name = roomName.toLowerCase().trim();

    if (name.includes("super deluxe") || name.includes("super")) {
        return {
            folder: "super_deluxe",
            images: [
                "AirBrush_20260504151623.jpg", "HNG.png",
                "IMG_6676.JPG", "IMG_6677(1).JPG", "IMG_6677.JPG",
                "IMG_6680.JPG", "IMG_6682.JPG", "IMG_6684.JPG",
                "IMG_6686.JPG", "IMG_6691.JPG", "IMG_6693.JPG",
                "IMG_6698.JPG", "IMG_6699.JPG", "IMG_6701.JPG",
                "IMG_6705.JPG", "IMG_6717.JPG", "IMG_7960.JPG",
            ],
        };
    }
    if (name.includes("premium standard") || name.includes("premium")) {
        return {
            folder: "standard_premium",
            images: [
                "HNG (1).jpg",
                "IMG_6548.JPG", "IMG_6549.JPG", "IMG_6551.JPG",
                "IMG_6553.JPG", "IMG_6564.JPG", "IMG_6566.JPG",
                "IMG_6568.JPG", "IMG_6570.JPG", "IMG_6580.JPG",
                "IMG_6591.JPG", "IMG_6593.JPG", "IMG_6594.JPG",
                "IMG_6595.JPG", "IMG_6598.JPG", "IMG_6602.JPG",
                "IMG_6613.JPG", "IMG_6615.JPG", "IMG_6619.JPG",
            ],
        };
    }
    if (name.includes("deluxe")) {
        return {
            folder: "premium_deluxe",
            images: [
                "HNG.jpg", "HNG(1).jpg",
                "IMG_6623.JPG", "IMG_6624.JPG", "IMG_6627 Copy.JPG",
                "IMG_6631.JPG", "IMG_6635.JPG", "IMG_6636.JPG",
                "IMG_6639.JPG", "IMG_6642.JPG", "IMG_6651.JPG",
                "IMG_6662.JPG", "IMG_6665.JPG", "IMG_6667.JPG",
                "IMG_6672.JPG", "IMG_6674.JPG",
            ],
        };
    }
    if (name.includes("standard")) {
        return {
            folder: "standard",
            images: [
                "HNG.jpg", "HNG(1).JPG", "HNG(2).JPG", "HNG(3).jpg",
                "HNG(4).JPG", "HNG(5).JPG", "HNG(6).JPG",
                "HNG(7).JPG", "HNG(8).jpg",
            ],
        };
    }

    return null;
}

export default async function RoomGalleryPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = await params;

    const { data: room, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();

    if (error || !room) {
        console.error("Room fetch error:", error, "roomId:", roomId);
        return (
            <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <h1>Room not found</h1>
                    <Link href="/rooms">Back to Rooms</Link>
                </div>
            </main>
        );
    }

    const galleryConfig = getRoomGalleryConfig(room.name || "");
    const imageBaseUrl = galleryConfig
        ? `/images/hotel/rooms-gallery/${galleryConfig.folder}/`
        : null;

    return (
        <main className={styles.main}>
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "https://www.hotelnewganga.in" },
                    { name: "Rooms & Suites", url: "https://www.hotelnewganga.in/rooms" },
                    { name: `${room.name} Gallery`, url: `https://www.hotelnewganga.in/rooms/${roomId}/gallery` },
                ]}
            />

            {/* Header Bar */}
            <div className={styles.pageHeader}>
                <div className={styles.headerInner}>
                    <Link href="/rooms" className={styles.backLink}>
                        <ArrowLeft size={18} />
                        Back to Rooms
                    </Link>
                    <div className={styles.titleBlock}>
                        <span className={styles.eyebrow}>Photo Gallery</span>
                        <h1>{room.name}</h1>
                    </div>
                    <Link href={`/book?room=${room.id}`} className={styles.bookBtn}>
                        <CalendarCheck size={18} />
                        Book Now
                    </Link>
                </div>
            </div>

            {/* Gallery Grid */}
            <section className={styles.gallerySection}>
                <div className={styles.container}>
                    {!galleryConfig || !imageBaseUrl ? (
                        <div className={styles.noImages}>
                            <p>Gallery coming soon for this room type.</p>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {galleryConfig.images.map((filename, idx) => (
                                <div key={idx} className={styles.gridItem}>
                                    <Image
                                        src={`${imageBaseUrl}${encodeURIComponent(filename)}`}
                                        alt={`${room.name} - Photo ${idx + 1}`}
                                        fill
                                        className={styles.img}
                                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Bottom CTA */}
                    <div className={styles.cta}>
                        <h2>Love what you see?</h2>
                        <p>Reserve your {room.name} and experience unparalleled comfort.</p>
                        <Link href={`/book?room=${room.id}`} className={styles.ctaBtn}>
                            <CalendarCheck size={20} />
                            Reserve — ₹{room.price_starting} / night
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
