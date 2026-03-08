"use client";

import { MapPin, Navigation, Car, Train, Plane, Clock } from "lucide-react";
import styles from "./page.module.css";
import Image from "next/image";
import PromoBanner from "@/components/PromoBanner";

export default function LocationPage() {
    const landmarks = [
        { name: "Nemcare Super Speciality Hospital", distance: "0.3 km", time: "5-min walk", type: "Healthcare", priority: true },
        { name: "Guwahati Medical College (GMCH)", distance: "0.6 km", time: "6-min walk", type: "Healthcare", priority: true },
        { name: "Assam State Zoo & Botanical Garden", distance: "1.7 km", time: "10-min drive", type: "Leisure", priority: false },
        { name: "ISKCON Guwahati", distance: "1.8 km", time: "12-min drive", type: "Religious", priority: false },
        { name: "City Center Mall", distance: "2.2 km", time: "15-min drive", type: "Retail", priority: false },
        { name: "Guwahati Railway Station", distance: "3.5 km", time: "20-min drive", type: "Transit", priority: false },
        { name: "LGBI International Airport", distance: "22 km", time: "45-min drive", type: "Transit", priority: false },
    ];

    return (
        <main className={styles.main}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className="fade-in">Location & Connectivity</h1>
                    <p className="fade-in">Strategically located below Bhangagarh Bridge on G.S. Road, offering unmatched access to Guwahati's premium healthcare and commercial hubs.</p>
                </div>
            </section>

            {/* Map & Transit Guide */}
            <section className={styles.transitSection}>
                <div className={styles.container}>
                    <div className={styles.grid}>

                        <div className={styles.mapCol}>
                            <div className={styles.mapWrapper}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.9693886841546!2d91.76536467563892!3d26.165126391817246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a5be6763d309b%3A0xfc39d947dd6b5414!2z8J2Xm_Cdl7zwnZiB8J2XsvCdl7kg8J2XofCdl7LwnZiEIPCdl5rwnZeu8J2Xu_Cdl7TwnZeu!5e0!3m2!1sen!2sin!4v1772952208900!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade">
                                </iframe>
                            </div>
                        </div>

                        <div className={styles.guideCol}>
                            <h2>Medical Transit Guide</h2>
                            <p className={styles.subtitle}>Our location is carefully chosen to provide convenience and peace of mind for families attending to medical needs in Guwahati.</p>

                            <div className={styles.landmarksList}>
                                {landmarks.map((mark, i) => (
                                    <div key={i} className={`${styles.landmarkItem} ${mark.priority ? styles.highlighted : ""}`}>
                                        <div className={styles.markIcon}>
                                            {mark.type === "Healthcare" ? <Clock size={20} /> : <Navigation size={20} />}
                                        </div>
                                        <div className={styles.markContent}>
                                            <h4>{mark.name}</h4>
                                            <p>{mark.distance} &bull; {mark.time}</p>
                                        </div>
                                        {mark.priority && <span className={styles.badge}>Primary Hub</span>}
                                    </div>
                                ))}
                            </div>

                            <div className={styles.transportOptions}>
                                <h3>Connectivity</h3>
                                <div className={styles.transportGrid}>
                                    <div className={styles.transportCard}>
                                        <Plane size={24} className={styles.tIcon} />
                                        <p>Airport Transfers available upon request</p>
                                    </div>
                                    <div className={styles.transportCard}>
                                        <Train size={24} className={styles.tIcon} />
                                        <p>Easy access via cabs from Railway Station</p>
                                    </div>
                                    <div className={styles.transportCard}>
                                        <Car size={24} className={styles.tIcon} />
                                        <p>Local auto & cab stand adjacent to complex</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </section>

            {/* CTA Promo Banner */}
            <PromoBanner />

        </main>
    );
}
