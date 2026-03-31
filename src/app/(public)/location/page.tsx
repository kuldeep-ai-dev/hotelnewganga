import { Navigation, Car, Train, Plane, Clock, MapPin, ArrowRight } from "lucide-react";
import styles from "./page.module.css";
import PromoBanner from "@/components/PromoBanner";
import Link from "next/link";
import { LocationFAQSchema, BreadcrumbSchema } from "@/components/JsonLdSchema";
import { getSiteContent } from "@/lib/cms";

export default async function LocationPage() {
    const heroBg = "/images/hotel/fRONT/DSC_8897.JPG";

    const landmarks = [
        { name: "Nemcare Super Speciality Hospital", distance: "0.3 km", time: "5-min walk", type: "Healthcare", priority: true },
        { name: "Guwahati Medical College (GMCH)", distance: "0.6 km", time: "6-min walk", type: "Healthcare", priority: true },
        { name: "Assam State Zoo & Botanical Garden", distance: "1.7 km", time: "10-min drive", type: "Leisure", priority: false },
        { name: "ISKCON Guwahati", distance: "1.8 km", time: "12-min drive", type: "Religious", priority: false },
        { name: "City Center Mall", distance: "2.2 km", time: "15-min drive", type: "Retail", priority: false },
        { name: "Kamakhya Temple", distance: "9.0 km", time: "25-min drive", type: "Religious", priority: false },
        { name: "Guwahati Railway Station", distance: "3.5 km", time: "20-min drive", type: "Transit", priority: false },
        { name: "LGBI International Airport", distance: "22.0 km", time: "45-min drive", type: "Transit", priority: false },
    ];

    return (
        <main className={styles.main}>
            {/* JSON-LD Schema */}
            <LocationFAQSchema />
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "https://www.hotelnewganga.in" },
                    { name: "Location", url: "https://www.hotelnewganga.in/location" },
                ]}
            />

            {/* Premium Hero */}
            <header className={styles.heroWrapper}>
                <div 
                    className={styles.heroImage}
                    style={{ backgroundImage: `url(${heroBg})` }}
                />
                <div className={styles.heroOverlay}>
                    <div className={styles.heroContent}>
                        <span className={`fade-in ${styles.eyebrow}`}>Accessibility</span>
                        <h1 className="fade-in">Location & Connectivity</h1>
                        <p className="fade-in">Strategically positioned on G.S. Road, offering unmatched access to premium healthcare and commercial hubs.</p>
                    </div>
                </div>
            </header>

            {/* Map & Transit Block */}
            <section className={styles.transitSection}>
                <div className={styles.container}>

                    {/* Elegant Intro paragraph */}
                    <div className={styles.introBlock}>
                        <p className={styles.dropCapText}>
                            Hotel New Ganga is located at Kaiser Commercial Complex, GS Road, Bhangagarh, Guwahati — one of Assam&apos;s most well-connected commercial corridors.
                            Our hotel is just a <strong>5-minute walk (0.3 km) from Nemcare Hospital</strong> and a <strong>6-minute walk (0.6 km) from GMCH</strong>,
                            making it the ideal choice for medical visitors and patient attendants requiring seamless daily access.
                        </p>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.mapCol}>
                            <div className={styles.mapWrapper}>
                                <div className={styles.mapBorder}>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.9693886841546!2d91.76536467563892!3d26.165126391817246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a5be6763d309b%3A0xfc39d947dd6b5414!2z8J2Xm_Cdl7zwnZiB8J2XsvCdl7kg8J2XofCdl7LwnZiE8J2XmvCdl67wnZe78J2XtPCdl64!5e0!3m2!1sen!2sin!4v1772952208900!5m2!1sen!2sin"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Hotel New Ganga location on Google Maps">
                                    </iframe>
                                </div>
                            </div>
                        </div>

                        <div className={styles.guideCol}>
                            <span className={styles.sectionLabel}>Neighbourhood Guide</span>
                            <h2>Medical & Transit Hub</h2>

                            <div className={styles.landmarksList}>
                                {landmarks.map((mark, i) => (
                                    <div key={i} className={`${styles.landmarkItem} ${mark.priority ? styles.highlighted : ""}`}>
                                        <div className={styles.markIcon}>
                                            {mark.type === "Healthcare" ? <Clock size={20} /> : <MapPin size={20} />}
                                        </div>
                                        <div className={styles.markContent}>
                                            <h4>{mark.name}</h4>
                                            <p>{mark.distance} &bull; {mark.time}</p>
                                        </div>
                                        {mark.priority && <span className={styles.badge}>Priority Hub</span>}
                                    </div>
                                ))}
                            </div>

                            <div className={styles.transportOptions}>
                                <h3>Connectivity Access</h3>
                                <div className={styles.transportGrid}>
                                    <div className={styles.transportCard}>
                                        <Plane size={24} className={styles.tIcon} />
                                        <p>Airport Transfers available via desk</p>
                                    </div>
                                    <div className={styles.transportCard}>
                                        <Train size={24} className={styles.tIcon} />
                                        <p>3.5km from Guwahati Railway</p>
                                    </div>
                                    <div className={styles.transportCard}>
                                        <Car size={24} className={styles.tIcon} />
                                        <p>Adjacent cab rank & auto stand</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Beautiful Page Footer Links */}
            <section className={styles.pageFooter}>
                <div className={styles.footerLinksGrid}>
                    <Link href="/rooms" className={styles.footerLinkCard}>
                        <span className={styles.cardEyebrow}>Stay</span>
                        <h3>Reserve a Room</h3>
                        <ArrowRight className={styles.cardIcon} size={24} />
                    </Link>
                    <Link href="/restaurant" className={styles.footerLinkCard}>
                        <span className={styles.cardEyebrow}>Explore</span>
                        <h3>Dining Experience</h3>
                        <ArrowRight className={styles.cardIcon} size={24} />
                    </Link>
                </div>
            </section>

        </main>
    );
}
