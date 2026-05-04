import { Suspense } from "react";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";
import BookingForm from "./BookingForm";
import { BedDouble, Clock, MapPin, Wifi } from "lucide-react";
import MotionReveal from "@/components/MotionReveal";

export const revalidate = 0;
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
                    <div className={styles.gridWrapper}>
                        
                        {/* Left Info Panel */}
                        <div className={styles.infoPanel}>
                            <MotionReveal direction="up" delay={0.1}>
                                <div className={styles.infoContent}>
                                    <h2>Why Book<br/>With Us?</h2>
                                    <p>Experience unparalleled comfort and true Assamese hospitality right in the heart of Guwahati.</p>
                                    
                                    <ul className={styles.benefitsList}>
                                        <li className={styles.benefitItem}>
                                            <div className={styles.iconBox}><MapPin size={22} /></div>
                                            <div className={styles.benefitText}>
                                                <h4>Prime Location</h4>
                                                <p>0.3km from Nemcare & 0.6km from GMCH.</p>
                                            </div>
                                        </li>
                                        <li className={styles.benefitItem}>
                                            <div className={styles.iconBox}><Clock size={22} /></div>
                                            <div className={styles.benefitText}>
                                                <h4>24/7 Service</h4>
                                                <p>Round-the-clock front desk and room dining.</p>
                                            </div>
                                        </li>
                                        <li className={styles.benefitItem}>
                                            <div className={styles.iconBox}><BedDouble size={22} /></div>
                                            <div className={styles.benefitText}>
                                                <h4>Premium Comfort</h4>
                                                <p>Air-conditioned rooms with luxury bedding.</p>
                                            </div>
                                        </li>
                                        <li className={styles.benefitItem}>
                                            <div className={styles.iconBox}><Wifi size={22} /></div>
                                            <div className={styles.benefitText}>
                                                <h4>Free High-Speed Wi-Fi</h4>
                                                <p>Stay connected with enterprise-grade internet.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </MotionReveal>
                        </div>

                        {/* Right Form Panel */}
                        <div className={styles.formPanel}>
                            <MotionReveal direction="up" delay={0.2}>
                                <div className={styles.headerArea}>
                                    <h2>Guest Details</h2>
                                    <p>Please provide your contact info to secure your reservation instantly.</p>
                                </div>

                                <Suspense fallback={<div style={{padding: '40px', textAlign: 'center'}}>Loading form...</div>}>
                                    <BookingForm rooms={rooms} />
                                </Suspense>
                            </MotionReveal>
                        </div>
                        
                    </div>
                </div>
            </section>
        </main>
    );
}
