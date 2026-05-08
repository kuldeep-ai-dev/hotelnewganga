import Image from "next/image";
import Link from "next/link";
import { Users, PartyPopper, Utensils, ArrowRight, LayoutGrid } from "lucide-react";
import styles from "./page.module.css";
import ReservationForm from "@/components/ReservationForm";
import { BreadcrumbSchema } from "@/components/JsonLdSchema";

export default async function BanquetPage() {
    const bannerBg = "/images/hotel/banquet/IMG_6838-2.JPG";
    const contentImage = "/images/hotel/banquet/IMG_6819.JPG";
    const galleryImages = [
        "/images/hotel/banquet/IMG_6826-2.JPG",
        "/images/hotel/banquet/IMG_6838-2.JPG",
        "/images/hotel/banquet/IMG_6842-2.JPG",
        "/images/hotel/banquet/IMG-20260506-WA0007.jpg",
        "/images/hotel/banquet/IMG-20260506-WA0005.jpg",
        "/images/hotel/banquet/IMG-20260506-WA0006.jpg"
    ];

    return (
        <main className={styles.main}>
            {/* Note: We removed RestaurantSchema. If you want a specialized EventVenue schema, it can be added here. */}
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "https://www.hotelnewganga.in" },
                    { name: "Banquet Hall", url: "https://www.hotelnewganga.in/banquet" },
                ]}
            />

            {/* Premium Hero */}
            <header className={styles.heroWrapper}>
                <div
                    className={styles.heroImage}
                    style={{ backgroundImage: `url(${bannerBg})` }}
                />
                <div className={styles.heroOverlay}>
                    <div className={styles.heroContent}>
                        <span className={`fade-in ${styles.eyebrow}`}>Events & Celebrations</span>
                        <h1 className="fade-in">Premium Banquet Hall</h1>
                        <p className="fade-in">Host Meetings, Parties, and Birthday Celebrations with our exclusive buffet food system.</p>
                    </div>
                </div>
            </header>

            {/* Split Content Segment */}
            <section className={styles.diningSection}>
                <div className={styles.container}>
                    <div className={styles.diningGrid}>

                        <div className={styles.diningText}>
                            <span className={styles.sectionLabel}>The Experience</span>
                            <h2>Unforgettable Events on GS Road</h2>
                            <p className={styles.dropCapText}>
                                Our premium banquet hall stands as a beacon of elegance, offering flexible spaces for a wide variety of events. Experience top-tier service tailored perfectly to your specific requirements, right in the heart of the city.
                            </p>
                            <p className={styles.subText}>
                                Whether you&apos;re organizing a professional corporate meeting, celebrating a milestone birthday, or throwing an engaging social party, our venue guarantees a memorable experience. We feature a seamless, fully-catered <strong>buffet food system</strong> to leave your guests delighted.
                            </p>

                            <div className={styles.timingCard}>
                                <ul className={styles.infoList}>
                                    <li>
                                        <div className={styles.iconBox}><Users size={16} /></div>
                                        <div>
                                            <strong>Meetings & Conferences</strong>
                                            <span>Professional setups for corporate events</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={styles.iconBox}><PartyPopper size={16} /></div>
                                        <div>
                                            <strong>Birthday Celebrations & Parties</strong>
                                            <span>Customizable layouts for social gatherings</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={styles.iconBox}><Utensils size={16} /></div>
                                        <div>
                                            <strong>Buffet Food System</strong>
                                            <span>Comprehensive catering ranging from local to continental</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Staggered beautiful dual image showcase instead of 4 generic boxes */}
                        <div className={styles.imageShowcase}>
                            <div className={styles.mainImageWrap}>
                                <Image src={contentImage} alt="Best Banquet Hall on GS Road Bhangagarh at Hotel New Ganga Guwahati" fill sizes="(max-width: 768px) 100vw, 50vw" className={styles.objectCover} />
                            </div>
                            <div className={styles.accentCard}>
                                <h4>Reserve The Hall</h4>
                                <p>Guarantee your preferred dates for a spectacular celebration.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Banquet Hall Gallery Section */}
            <section className={styles.galleryWrapper} style={{ padding: '6rem 0', backgroundColor: '#f8f9fa' }}>
                <div className={styles.container}>
                    <div className={styles.formHeader} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <span className={styles.sectionLabel} style={{ justifyContent: 'center' }}><LayoutGrid size={16} style={{ marginRight: '8px' }} /> Visual Showcase</span>
                        <h2 style={{ color: '#0f172a', marginBottom: '1rem', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Banquet Hall Gallery</h2>
                        <p style={{ color: '#475569', fontSize: '1.1rem' }}>Take a glimpse into our beautifully decorated event spaces.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {galleryImages.map((src, idx) => (
                            <div key={idx} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                                <Image
                                    src={src}
                                    alt={`Banquet Hall Gallery Image ${idx + 1}`}
                                    fill
                                    className={styles.objectCover}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dark form wrapper */}
            <section className={styles.reservationWrapper}>
                <div className={styles.container}>
                    <div className={styles.formContainer}>
                        <div className={styles.formHeader}>
                            <h2>Event Inquiries</h2>
                            <p>Get in touch with us to book the Banquet Hall for your next big event.</p>
                        </div>
                        <ReservationForm />
                    </div>
                </div>
            </section>

            {/* Beautiful Page Footer Links */}
            <section className={styles.pageFooter}>
                <div className={styles.footerLinksGrid}>
                    <Link href="/rooms" className={styles.footerLinkCard}>
                        <span className={styles.cardEyebrow}>Stay</span>
                        <h3>Rooms & Suites</h3>
                        <ArrowRight className={styles.cardIcon} size={24} />
                    </Link>
                    <Link href="/location" className={styles.footerLinkCard}>
                        <span className={styles.cardEyebrow}>Navigate</span>
                        <h3>Location & Map</h3>
                        <ArrowRight className={styles.cardIcon} size={24} />
                    </Link>
                </div>
            </section>
        </main>
    );
}
