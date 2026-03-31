"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "@/app/(public)/page.module.css";

export default function AnimatedHeroImage({ heroBg }: { heroBg: string }) {
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // The WelcomeAnimation sets sessionStorage immediately on its mount if it fired.
        // We can check if it just happened this very millisecond to sync our parallax.
        // But since we want the image to shrink AS the curtain pulls away (t=3.0s),
        // we have a clean conditional check.
        // Wait, the cleanest way without a global context is to always animate if sessionStorage was NOT set before THIS render cycle.
        const hasFiredBefore = sessionStorage.getItem("hng_parallax_done");
        
        if (!hasFiredBefore) {
            setShouldAnimate(true);
            sessionStorage.setItem("hng_parallax_done", "true");
        }
    }, []);

    // Server-side mismatch prevention: if not mounted, render it as normal scale
    if (!isMounted) {
        return (
             <div 
                className={styles.heroImage}
                style={{ backgroundImage: `url(${heroBg})`, transform: "scale(1.05)" }}
            />
        );
    }

    // Sequence: t=0.0s to 3.0s (Scale is 1.25)
    // t=3.0s (When the curtain splits), Scale moves to 1.05 (the standard CSS slow pan resting scale)
    const zoomVariants: Variants = {
        zoom: { scale: 1.25 },
        release: { scale: 1.05, transition: { delay: 3.0, duration: 1.4, ease: [0.33, 1, 0.68, 1] as const } }
    };

    return (
        <motion.div 
            className={styles.heroImage}
            style={{ backgroundImage: `url(${heroBg})` }}
            variants={zoomVariants}
            initial={shouldAnimate ? "zoom" : "release"}
            animate="release"
        />
    );
}
