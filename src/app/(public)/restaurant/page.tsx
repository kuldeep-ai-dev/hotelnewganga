import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Utensils, ArrowRight } from "lucide-react";
import styles from "./page.module.css";
import ReservationForm from "@/components/ReservationForm";
import { getSiteContent } from "@/lib/cms";
import { RestaurantSchema, BreadcrumbSchema } from "@/components/JsonLdSchema";

export default async function RestaurantPage() {
    const bannerBg = "/images/hotel/rESTAURANT/DSC_8882.JPG";
    const contentImage = "/images/hotel/rESTAURANT/DSC_8884.JPG";

    return (
        <main className={styles.main}>
            <RestaurantSchema />
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "https://www.hotelnewganga.in" },
                    { name: "Restaurant", url: "https://www.hotelnewganga.in/restaurant" },
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
                        <span className={`fade-in ${styles.eyebrow}`}>Dining</span>
                        <h1 className="fade-in">Multi-Cuisine Restaurant</h1>
                        <p className="fade-in">Authentic local flavors & continental classics in a warm, elegant setting.</p>
                    </div>
                </div>
            </header>

            {/* Split Content Segment */}
            <section className={styles.diningSection}>
                <div className={styles.container}>
                    <div className={styles.diningGrid}>
                        
                        <div className={styles.diningText}>
                            <span className={styles.sectionLabel}>The Experience</span>
                            <h2>Culinary Excellence on GS Road</h2>
                            <p className={styles.dropCapText}>
                                Our in-house restaurant stands as a beacon of flavor, offering a curated multi-cuisine menu. From rich Assamese specialties to comforting North Indian favourites, Chinese dishes, and Continental classics, every meal is prepared with passion.
                            </p>
                            <p className={styles.subText}>
                                Whether you&apos;re visiting Guwahati for business, attending family at the hospital, or exploring the city, enjoy sophisticated, affordable dining. Don&apos;t feel like leaving your room? We offer seamless <strong>24-hour room service</strong> for our guests.
                            </p>

                            <div className={styles.timingCard}>
                                <ul className={styles.infoList}>
                                    <li>
                                        <div className={styles.iconBox}><Clock size={16} /></div>
                                        <div>
                                            <strong>Breakfast Service</strong>
                                            <span>7:30 AM – 10:30 AM</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={styles.iconBox}><Clock size={16} /></div>
                                        <div>
                                            <strong>Lunch & Dinner</strong>
                                            <span>12:30 PM – 10:30 PM</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={styles.iconBox}><Utensils size={16} /></div>
                                        <div>
                                            <strong>In-Room Dining</strong>
                                            <span>Available 24 Hours</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Staggered beautiful dual image showcase instead of 4 generic boxes */}
                        <div className={styles.imageShowcase}>
                            <div className={styles.mainImageWrap}>
                                <Image src={contentImage} alt="Best Restaurant on GS Road Bhangagarh at Hotel New Ganga Guwahati" fill sizes="(max-width: 768px) 100vw, 50vw" className={styles.objectCover} />
                            </div>
                            <div className={styles.accentCard}>
                                <h4>Reserve Your Table</h4>
                                <p>Guarantee your spot for a delightful dining experience with friends or family.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Dark form wrapper */}
            <section className={styles.reservationWrapper}>
                <div className={styles.container}>
                    <div className={styles.formContainer}>
                        <div className={styles.formHeader}>
                            <h2>Table Reservations</h2>
                            <p>For special occasions, business lunches, or group dining.</p>
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
