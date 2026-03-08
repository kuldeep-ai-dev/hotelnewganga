import styles from "./page.module.css";
import BookingWidget from "@/components/BookingWidget";
import RoomHighlights from "@/components/RoomHighlights";
import { getSeoMetadata } from "@/lib/seo";
import Link from "next/link";
import { getSiteContent } from "@/lib/cms";
import { supabase } from "@/lib/supabase";

export async function generateMetadata() {
  return await getSeoMetadata("/");
}

async function getRoomsForWidget() {
  const { data, error } = await supabase
    .from("rooms")
    .select("id, name")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching rooms for widget:", error);
    return [];
  }
  return data || [];
}

export default async function Home() {
  const [heroBg, rooms] = await Promise.all([
    getSiteContent("home_hero_bg", "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80"),
    getRoomsForWidget(),
  ]);

  return (
    <main className={styles.main}>
      <header
        className={styles.hero}
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroBg})` }}
      >
        <div className={styles.heroContent}>
          <h1 className="fade-in">Experience Comfort at Hotel New Ganga</h1>
          <p className="fade-in">Your premium stay in the heart of Guwahati, steps away from Nemcare Hospital.</p>
          <Link href="/book" className={`btn btn-primary fade-in ${styles.ctaBtn}`}>Book Now</Link>
        </div>
      </header>

      <BookingWidget rooms={rooms} />

      <RoomHighlights />

    </main>
  );
}
