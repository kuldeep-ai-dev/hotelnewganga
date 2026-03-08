import { Suspense } from "react";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";
import BookingForm from "./BookingForm";

async function getRooms() {
    const { data, error } = await supabase
        .from("rooms")
        .select("id, name")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("Error fetching rooms for booking form:", error);
        return [];
    }
    return data || [];
}

export default async function BookRoomPage() {
    const rooms = await getRooms();

    return (
        <main className={styles.main}>
            <header className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className="fade-in">Reserve Your Stay</h1>
                    <p className="fade-in">Book your premium room at Hotel New Ganga.</p>
                </div>
            </header>

            <section className={styles.bookingSection}>
                <div className={styles.container}>
                    <div className={styles.formCard}>
                        <div className={styles.headerArea}>
                            <h2>Guest Details</h2>
                            <p>Please provide your information to secure your reservation.</p>
                        </div>

                        <Suspense fallback={<div>Loading form...</div>}>
                            <BookingForm rooms={rooms} />
                        </Suspense>

                    </div>
                </div>
            </section>
        </main>
    );
}
