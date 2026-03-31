"use client";

import { useState } from "react";
import styles from "./CorporateInquiryForm.module.css";

export default function CorporateInquiryForm() {
    const [formData, setFormData] = useState({
        company_name: "",
        contact_person: "",
        email: "",
        phone: "",
        details: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

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
        <div className={styles.formWrapper}>
            <h3>Corporate Inquiry</h3>
            <p>Fill out the form below and our sales team will create a tailored package for your organization.</p>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label htmlFor="corp-company">Company/Organization Name</label>
                    <input
                        id="corp-company"
                        type="text"
                        required
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="corp-contact">Contact Person</label>
                    <input
                        id="corp-contact"
                        type="text"
                        required
                        value={formData.contact_person}
                        onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    />
                </div>

                <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="corp-email">Email Address</label>
                        <input
                            id="corp-email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="corp-phone">Phone Number</label>
                        <input
                            id="corp-phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="corp-details">Requirements (Dates, No. of Rooms, etc.)</label>
                    <textarea
                        id="corp-details"
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
    );
}
