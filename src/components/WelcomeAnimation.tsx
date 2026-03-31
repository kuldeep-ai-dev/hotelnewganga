"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import styles from "./WelcomeAnimation.module.css";

export default function WelcomeAnimation() {
    const [isVisible, setIsVisible] = useState(false);
    const [phase, setPhase] = useState<"greeting" | "split" | "done">("greeting");

    useEffect(() => {
        const hasSeen = sessionStorage.getItem("hng_welcome_seen");
        
        if (!hasSeen) {
            setIsVisible(true);
            sessionStorage.setItem("hng_welcome_seen", "true");
            document.body.style.overflow = "hidden";

            // Sequence Timing
            // t=0s to 2.5s: Greeting writes out
            // t=2.8s: Initiate Split Parallax
            const splitTimer = setTimeout(() => {
                setPhase("split");
            }, 3000);

            // t=4.0s: Completely remove animation block
            const doneTimer = setTimeout(() => {
                setPhase("done");
                setIsVisible(false);
                document.body.style.overflow = "auto";
            }, 4200);

            return () => {
                clearTimeout(splitTimer);
                clearTimeout(doneTimer);
                document.body.style.overflow = "auto";
            };
        }
    }, []);

    if (!isVisible) return null;

    // Orchestration physics
    const springTransition = { type: "spring", damping: 25, stiffness: 120 };
    
    // Top Door
    const topDoorVariants: Variants = {
        greeting: { y: "0%" },
        split: { y: "-100%", transition: { duration: 1.2, ease: [0.77, 0, 0.175, 1] as const } }
    };

    // Bottom Door
    const bottomDoorVariants: Variants = {
        greeting: { y: "0%" },
        split: { y: "100%", transition: { duration: 1.2, ease: [0.77, 0, 0.175, 1] as const } }
    };

    // Masked Text Reveal
    const maskTextVariants: Variants = {
        hidden: { y: "110%", opacity: 0 },
        visible: { y: "0%", opacity: 1, transition: { type: "spring" as const, damping: 20, stiffness: 100, delay: 0.2 } },
        exit: { y: "-100%", opacity: 0, transition: { duration: 0.4 } }
    };

    const charVariants: Variants = {
        hidden: { y: "100%", opacity: 0 },
        visible: { y: "0%", opacity: 1, transition: { type: "spring" as const, stiffness: 120, damping: 20 } },
        exit: { opacity: 0 }
    };

    const englishString = "NOMOSKAR";

    return (
        <div className={styles.curtainWrapper}>
            {/* The physical split doors */}
            <motion.div 
                className={styles.curtainTop} 
                variants={topDoorVariants}
                initial="greeting"
                animate={phase}
            />
            <motion.div 
                className={styles.curtainBottom} 
                variants={bottomDoorVariants}
                initial="greeting"
                animate={phase}
            />

            {/* The UI Elements inside the curtain */}
            <AnimatePresence>
                {phase === "greeting" && (
                    <motion.div 
                        className={styles.content}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Golden Expanding Line */}
                        <motion.div 
                            className={styles.goldLine}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            exit={{ scaleX: 0, opacity: 0, transition: { duration: 0.5 } }}
                        />

                        {/* Masking Container (hides overflow) */}
                        <div className={styles.textMask}>
                            <motion.h1 variants={maskTextVariants} className={styles.assameseText}>
                                নমস্কাৰ
                            </motion.h1>
                        </div>
                        
                        {/* Staggered English Text */}
                        <div className={styles.textMask}>
                            <motion.div 
                                className={styles.englishTextWrapper}
                                variants={{
                                    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.8 } },
                                    exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } }
                                }}
                            >
                                {englishString.split("").map((char, index) => (
                                    <motion.span key={index} variants={charVariants} className={styles.char}>
                                        {char === " " ? "\u00A0" : char}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </div>

                        {/* Final Brand Stamp */}
                        <motion.div 
                            className={styles.brandStamp}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1, transition: { delay: 1.8, duration: 1.2 } }}
                            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.4 } }}
                        >
                            <h2>Hotel New Ganga</h2>
                            <p>A Legacy of Assamese Hospitality</p>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
