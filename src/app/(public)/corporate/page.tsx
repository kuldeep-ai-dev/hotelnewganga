"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Briefcase, Building, PhoneCall, Handshake } from "lucide-react";
import styles from "./page.module.css";

import { getSiteContent } from "@/lib/cms";

export default function CorporatePage() {
    const [heroBg, setHeroBg] = useState("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80");
    const [formData, setFormData] = useState({
        company_name: "",
        contact_person: "",
        email: "",
        phone: "",
        details: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchCMS = async () => {
            const bg = await getSiteContent("corporate_banner");
            if (bg) setHeroBg(bg);
        };
        fetchCMS();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        const res = await fetch("/api/corporate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            setMessage("Failed to submit inquiry. Please try again.");
        } else {
            setMessage("Inquiry sent successfully! Our corporate sales team will contact you shortly.");
            setFormData({
                company_name: "",
                contact_person: "",
                email: "",
                phone: "",
                details: "",
            });
        }
        setIsSubmitting(false);
    };

    return (
        <main className={styles.main}>
            {/* Hero Section */}
            <section
                className={styles.hero}
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBg})` }}
            >
                <div className={styles.heroContent}>
                    <h1 className="fade-in">Corporate & Extended Stays</h1>
                    <p className="fade-in">Tailored hospitality solutions for businesses, medical associations, and group bookings.</p>
                </div>
            </section>

            <section className={styles.contentSection}>
                <div className={styles.container}>
                    <div className={styles.grid}>

                        <div className={styles.infoCol}>
                            <h2>Business Hospitality Redefined</h2>
                            <p>Located on the bustling G.S. Road, Hotel New Ganga offers unmatched convenience for corporate travelers. Whether you need a block of rooms for a medical conference, extended stays for visiting executives, or customized billing cycles, our corporate desk handles it all seamlessly.</p>

                            <div className={styles.benefits}>
                                <div className={styles.benefitCard}>
                                    <Handshake className={styles.icon} size={32} />
                                    <h3>Special Tariffs</h3>
                                    <p>Discounted rates for bulk bookings and long-term stays.</p>
                                </div>
                                <div className={styles.benefitCard}>
                                    <Briefcase className={styles.icon} size={32} />
                                    <h3>Dedicated Support</h3>
                                    <p>Single point of contact for all your company's accommodation needs.</p>
                                </div>
                                <div className={styles.benefitCard}>
                                    <Building className={styles.icon} size={32} />
                                    <h3>GST Compliant</h3>
                                    <p>Hassle-free B2B invoicing with GSTIN support for proper claiming.</p>
                                </div>
                                <div className={styles.benefitCard}>
                                    <PhoneCall className={styles.icon} size={32} />
                                    <h3>24/7 Accessibility</h3>
                                    <p>Late check-ins and early check-outs accommodated for business flights.</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.formCol}>
                            <div className={styles.formWrapper}>
                                <h3>Corporate Inquiry</h3>
                                <p>Fill out the form below and our sales team will create a tailored package for your organization.</p>
                                <form className={styles.form} onSubmit={handleSubmit}>
                                    <div className={styles.inputGroup}>
                                        <label>Company/Organization Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.company_name}
                                            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>Contact Person</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.contact_person}
                                            onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                                        />
                                    </div>

                                    <div className={styles.inputRow}>
                                        <div className={styles.inputGroup}>
                                            <label>Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Phone Number</label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>Requirements (Dates, No. of Rooms, etc.)</label>
                                        <textarea
                                            rows={4}
                                            required
                                            value={formData.details}
                                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={isSubmitting}>
                                        {isSubmitting ? "Sending..." : "Request Proposal"}
                                    </button>
                                    {message && <p className={styles.message}>{message}</p>}
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
