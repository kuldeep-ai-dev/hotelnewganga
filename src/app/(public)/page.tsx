import styles from "./page.module.css";
import BookingWidget from "@/components/BookingWidget";
import RoomHighlights from "@/components/RoomHighlights";
import { getSeoMetadata } from "@/lib/seo";
import Link from "next/link";
import { getSiteContent } from "@/lib/cms";
import { supabase } from "@/lib/supabase";
import { BreadcrumbSchema } from "@/components/JsonLdSchema";
import { MapPin, Utensils, Briefcase, Shield, Wifi, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import GoogleReviews from "@/components/GoogleReviews";
import AnimatedHeroImage from "@/components/AnimatedHeroImage";
import MotionReveal from "@/components/MotionReveal";

export async function generateMetadata() {
  return await getSeoMetadata("/");
}

async function getRoomsForWidget() {
  const { data, error } = await supabase
    .from("rooms")
    .select("id, name, price_starting")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching rooms for widget:", error);
    return [];
  }
  return data || [];
}

export default async function Home() {
  const [rooms] = await Promise.all([
    getRoomsForWidget(),
  ]);

  const validPrices = rooms.map(r => r.price_starting).filter((p): p is number => p !== null && p !== undefined && p > 0);
  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 1286;
  const formattedMinPrice = new Intl.NumberFormat('en-IN').format(minPrice);

  const heroBg = "/images/hotel/SUPER%20DELUXE/IMG20241223165919.jpg";

  return (
    <main className={styles.main}>
      <BreadcrumbSchema items={[{ name: "Home", url: "https://www.hotelnewganga.in" }]} />

      {/* Premium Hero with Structured Framer Motion Parallax Image Container */}
      <header className={styles.heroWrapper}>
          <AnimatedHeroImage heroBg={heroBg} />
          <div className={styles.heroOverlay}>
              <div className={styles.heroContent}>
                  <p className={`fade-in ${styles.eyebrow}`}>Est. in Guwahati</p>
                  <h1 className="fade-in">Experience Comfort at Hotel New Ganga</h1>
                  <p className="fade-in">Your premium stay on GS Road, Bhangagarh — steps away from Nemcare Hospital & GMCH.</p>
                  <Link href="/book" className={`btn btn-primary fade-in ${styles.ctaBtn}`}>
                      Book Your Stay
                  </Link>
              </div>
          </div>
      </header>

      <MotionReveal direction="up" delay={0.1}>
          <BookingWidget rooms={rooms} />
      </MotionReveal>

      {/* Premium Split Desktop Layout for "Our Story" / SEO Intro */}
      <section className={styles.storySection}>
          <div className={styles.container}>
              <div className={styles.storyGrid}>
                  
                  {/* Text Column */}
                  <MotionReveal direction="left" delay={0.1} className={styles.storyTextContent}>
                      <span className={styles.sectionLabel}>Welcome to Hotel New Ganga</span>
                      <h2>A Legacy of Assamese Hospitality</h2>
                      <p className={styles.dropCapText}>
                         Hotel New Ganga represents a blend of contemporary comfort and warm local hospitality. 
                         Strategically located on <strong>GS Road, Bhangagarh</strong>, we are the premier choice for medical visitors — barely a 5-minute walk from <strong>Nemcare Hospital</strong> and 6 minutes from <strong>GMCH</strong>.
                      </p>
                      <p>
                         Whether you&apos;re visiting for medical consultations, corporate assignments, or exploring Guwahati with family, our AC rooms starting from <strong>₹{formattedMinPrice}/night</strong> ensure value without compromise. 
                         Enjoy an in-house multi-cuisine restaurant, free high-speed Wi-Fi, and a 24/7 dedicated front desk.
                      </p>
                      
                      <div className={styles.storyAction}>
                           <Link href="/location" className={styles.arrowLink}>
                               Explore our location <ArrowRight size={18} />
                           </Link>
                      </div>
                  </MotionReveal>

                  {/* Collage Column */}
                  <MotionReveal direction="right" delay={0.2} className={styles.storyImages}>
                       <div className={styles.imgPrimary}>
                            <Image 
                                src="/images/hotel/rECEPTION/DSC_8891.JPG" 
                                alt="Hotel New Ganga Reception Desk - Budget Hotel in Bhangagarh GS Road Guwahati" 
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className={styles.objectCover}
                            />
                       </div>
                       <div className={styles.imgSecondary}>
                            <Image 
                                src="/images/hotel/rESTAURANT/DSC_8882.JPG" 
                                alt="Multi-cuisine Restaurant near Nemcare Hospital at Hotel New Ganga Guwahati" 
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className={styles.objectCover}
                            />
                       </div>
                  </MotionReveal>

              </div>
          </div>
      </section>

      {/* Dark Premium "Why Choose Us" / Features Section */}
      <section className={styles.darkFeaturesSection}>
        <div className={styles.container}>
          <MotionReveal direction="up" className={styles.featuresHeader}>
              <span className={styles.goldText}>Guest Experience</span>
              <h2>Why Hotel New Ganga?</h2>
          </MotionReveal>
          
          <div className={styles.featuresGrid}>
            <MotionReveal delay={0.1} direction="up" className={styles.featureCardDark}>
              <div className={styles.iconWrapper}>
                  <MapPin size={24} />
              </div>
              <h3>Prime Location</h3>
              <p>0.3 km from Nemcare, 0.6 km from GMCH right on the arterial GS Road.</p>
            </MotionReveal>

            <MotionReveal delay={0.2} direction="up" className={styles.featureCardDark}>
              <div className={styles.iconWrapper}>
                  <Utensils size={24} />
              </div>
              <h3>In-House Dining</h3>
              <p>Multi-cuisine restaurant serving breakfast, lunch, dinner & 24/7 room service.</p>
            </MotionReveal>

            <MotionReveal delay={0.3} direction="up" className={styles.featureCardDark}>
              <div className={styles.iconWrapper}>
                  <Briefcase size={24} />
              </div>
              <h3>Corporate Rates</h3>
              <p>Business pricing, bulk discounts, and GST invoicing for seamless expensing.</p>
            </MotionReveal>

            <MotionReveal delay={0.4} direction="up" className={styles.featureCardDark}>
              <div className={styles.iconWrapper}>
                  <Wifi size={24} />
              </div>
              <h3>Modern Flow</h3>
              <p>Complimentary Wi-Fi, powerful AC, elevators, and meticulous daily housekeeping.</p>
            </MotionReveal>

            <MotionReveal delay={0.5} direction="up" className={styles.featureCardDark}>
              <div className={styles.iconWrapper}>
                  <Shield size={24} />
              </div>
              <h3>Secure Environment</h3>
              <p>24/7 CCTV surveillance, fire safety, and round-the-clock front desk assistance.</p>
            </MotionReveal>

            <MotionReveal delay={0.6} direction="up" className={styles.featureCardDark}>
              <div className={styles.iconWrapper}>
                  <Clock size={24} />
              </div>
              <h3>Book Direct & Save</h3>
              <p>Reserve through our portal for best guaranteed rates — no hidden OTA fees.</p>
            </MotionReveal>
          </div>
        </div>
      </section>

      <MotionReveal direction="up">
          <RoomHighlights />
      </MotionReveal>
      
      <MotionReveal direction="up" delay={0.2}>
          <GoogleReviews />
      </MotionReveal>
      
      {/* Decorative CTA Banner */}
      <section className={styles.ctaBanner}>
          <MotionReveal direction="up" className={styles.ctaBannerContent}>
              <h2>Ready to experience Guwahati?</h2>
              <p>Book directly on our website for the lowest prices guaranteed.</p>
              <Link href="/book" className="btn btn-primary">Check Availability</Link>
          </MotionReveal>
      </section>
      
    </main>
  );
}
