"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { PhoneCall, CheckCircle2 } from "lucide-react";
import styles from "./leadMagnet.module.css";

export default function LeadMagnetForm() {
    const [phone, setPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!phone || phone.length < 8) return;

        setIsSubmitting(true);

        const { error } = await supabase.from("hotel_leads").insert({
            contact_value: phone,
            lead_type: "Blog Call Back",
            status: "New"
        });

        setIsSubmitting(false);

        if (!error) {
            setIsSuccess(true);
        } else {
            console.error("Lead submission failed:", error);
            alert("Connection error. Please try clicking the WhatsApp button instead.");
        }
    };

    if (isSuccess) {
        return (
            <div className={styles.magnetContainer} style={{border: '2px solid #22c55e', background: '#f0fdf4'}}>
                <div className={styles.successMessage}>
                    <CheckCircle2 size={40} />
                    <div>
                        <h3 style={{fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '5px'}}>Request Received!</h3>
                        <p>Our 24/7 Front Desk is being notified. We will call you at <strong>{phone}</strong> momentarily.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.magnetContainer}>
            <div className={styles.magnetHeader}>
                <h3>Need an Urgent Booking?</h3>
                <p>Don't want to navigate online booking right now? Drop your phone number and our front desk will call you within 60 seconds.</p>
            </div>
            <form className={styles.magnetForm} onSubmit={handleSubmit}>
                <input 
                    type="tel" 
                    className={styles.inputField}
                    placeholder="Enter your mobile number..." 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required 
                />
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                    {isSubmitting ? "Connecting..." : (
                        <>Call Me Now <PhoneCall size={18}/></>
                    )}
                </button>
            </form>
        </div>
    );
}
