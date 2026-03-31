"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MessageCircle } from "lucide-react";
import styles from "./whatsapp.module.css";

export default function WhatsAppWidget() {
    const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);

    useEffect(() => {
        const fetchNumber = async () => {
            const { data } = await supabase
                .from("site_content")
                .select("content_value")
                .eq("content_key", "whatsapp_number")
                .single();

            if (data && data.content_value) {
                setWhatsappNumber(data.content_value);
            }
        };

        fetchNumber();
    }, []);

    if (!whatsappNumber) return null; // Module deactivates perfectly if admin clears the number!

    return (
        <a 
            href={`https://wa.me/${whatsappNumber}?text=Hello!%20I%20am%20looking%20for%20a%20booking%20at%20Hotel%20New%20Ganga.`}
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.floatWrapper}
            title="Chat with Reception"
        >
            <div className={styles.iconContainer}>
                <MessageCircle size={32} color="#ffffff" fill="#ffffff" />
            </div>
            {/* The pulsing notification dot creating extreme urgency */}
            <span className={styles.ping}></span>
        </a>
    );
}
