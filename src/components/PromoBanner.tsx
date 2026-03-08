"use client";

import Link from "next/link";
import styles from "./PromoBanner.module.css";

export default function PromoBanner() {
    return (
        <section className={styles.promoSection}>
            <div className={styles.promoContainer}>
                <div className={styles.promoContent}>
                    <h2>Ready to Experience True Comfort?</h2>
                    <p>Book your stay at Hotel New Ganga today and enjoy premium amenities steps away from Guwahati's medical and corporate hubs.</p>
                    <Link href="/book" className={`btn ${styles.promoBtn}`}>
                        Book Your Room
                    </Link>
                </div>
            </div>
        </section>
    );
}
