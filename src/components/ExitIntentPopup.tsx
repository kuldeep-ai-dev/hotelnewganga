"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Gift, Check, ArrowRight } from "lucide-react";
import styles from "./exitIntent.module.css";

export default function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [contact, setContact] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [hasFired, setHasFired] = useState(true); // Default true to prevent flash, effect checks storage

    useEffect(() => {
        // Prevent aggressive popup spam. Once per browser session.
        const alreadyShown = sessionStorage.getItem("hng_exit_intent_shown");
        if (alreadyShown) {
            return;
        }

        setHasFired(false);

        const handleMouseLeave = (e: MouseEvent) => {
            // If the mouse vertically leaves the top of the browser window (heading to tabs/URL bar)
            if (e.clientY <= 0 && !hasFired) {
                setIsVisible(true);
                setHasFired(true);
                sessionStorage.setItem("hng_exit_intent_shown", "true");
                
                // Remove listener once fired
                document.removeEventListener("mouseleave", handleMouseLeave);
            }
        };

        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [hasFired]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contact.trim()) return;

        setIsSubmitting(true);

        const { error } = await supabase.from("hotel_leads").insert({
            contact_value: contact,
            lead_type: "Exit-Intent VIP Discount",
            status: "New"
        });

        setIsSubmitting(false);

        if (!error) {
            setIsSuccess(true);
        } else {
            console.error("Lead capture failed:", error);
            // Even if DB fails (e.g., offline), give them the code to prioritize conversion
            setIsSuccess(true);
        }
    };

    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button 
                    className={styles.closeBtn} 
                    onClick={() => setIsVisible(false)}
                    title="Close"
                >
                    <X size={20} />
                </button>

                {!isSuccess ? (
                    <>
                        <div className={styles.header}>
                            <h2>Wait! Don't Miss Out.</h2>
                            <p>Unlock an exclusive 15% VIP Discount on your next booking at Hotel New Ganga.</p>
                        </div>
                        <div className={styles.body}>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="contact">Enter WhatsApp Number or Email</label>
                                    <input 
                                        type="text" 
                                        id="contact"
                                        className={styles.input} 
                                        placeholder="e.g., +91 9876543210 or email@domain.com"
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                                    {isSubmitting ? "Generating Code..." : (
                                        <>Reveal My 15% Code <Gift size={20} /></>
                                    )}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className={styles.body} style={{paddingTop: '50px', paddingBottom: '40px'}}>
                        <div className={styles.successState}>
                            <div className={styles.successIcon}>
                                <Check size={32} />
                            </div>
                            <h3>Success! Here is your code.</h3>
                            <p style={{marginBottom: '20px', color: '#64748b'}}>Provide this code at the Front Desk or over WhatsApp to claim your discount.</p>
                            <div className={styles.codeBox}>
                                VIPGANGA15
                            </div>
                            <button 
                                className={styles.submitBtn} 
                                onClick={() => setIsVisible(false)}
                            >
                                Continue Browsing <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
