import { Briefcase, Building, PhoneCall, Handshake, ArrowRight } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";
import CorporateInquiryForm from "@/components/CorporateInquiryForm";
import { getSiteContent } from "@/lib/cms";
import { BreadcrumbSchema } from "@/components/JsonLdSchema";

export default async function CorporatePage() {
    const heroBg = "/images/hotel/fRONT/DSC_8810.JPG";

    return (
        <main className={styles.main}>
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "https://www.hotelnewganga.in" },
                    { name: "Corporate Stays", url: "https://www.hotelnewganga.in/corporate" },
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
                        <span className={`fade-in ${styles.eyebrow}`}>Business Priority</span>
                        <h1 className="fade-in">Corporate Stays & Delegations</h1>
                        <p className="fade-in">Tailored hospitality for businesses, medical teams, and group bookings.</p>
                    </div>
                </div>
            </header>

            <section className={styles.contentSection}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        
                        <div className={styles.infoCol}>
                            <span className={styles.sectionLabel}>Corporate Desk</span>
                            <h2>Business Hospitality on GS Road</h2>
                            <p className={styles.dropCapText}>
                                Hotel New Ganga offers unmatched convenience and a streamlined experience for corporate travelers. 
                                Positioned steps from major healthcare complexes like Nemcare and GMCH, we specialize in 
                                extended stays for executives, accommodating medical conference teams, and providing customized billing for rep cohorts.
                            </p>

                            <div className={styles.benefitsGrid}>
                                <div className={styles.benefitCardDark}>
                                    <div className={styles.iconWrapper}><Handshake size={24} /></div>
                                    <h3>Corporate Tariffs</h3>
                                    <p>Exclusive discounted rates for bulk bookings and long-term accommodation limits.</p>
                                </div>
                                <div className={styles.benefitCardDark}>
                                    <div className={styles.iconWrapper}><Building size={24} /></div>
                                    <h3>GST Invoicing</h3>
                                    <p>Compliant B2B invoicing with GSTIN support for frictionless corporate expense claims.</p>
                                </div>
                                <div className={styles.benefitCardDark}>
                                    <div className={styles.iconWrapper}><Briefcase size={24} /></div>
                                    <h3>Dedicated Support</h3>
                                    <p>A single point of contact assigned to handle all your delegation&apos;s accommodation needs.</p>
                                </div>
                                <div className={styles.benefitCardDark}>
                                    <div className={styles.iconWrapper}><PhoneCall size={24} /></div>
                                    <h3>24/7 Access</h3>
                                    <p>Flexible business check-ins and late-night checkouts aligned with flight schedules.</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formCol}>
                            <div className={styles.formContainer}>
                                <div className={styles.formHeader}>
                                    <h3>Corporate Inquiry</h3>
                                    <p>Submit your requirements and our management will provide a custom quotation within 24 hours.</p>
                                </div>
                                <CorporateInquiryForm />
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
                        <h3>Explore Our Rooms</h3>
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
