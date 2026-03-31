"use client";

import { useState } from "react";
import { Calendar, Clock4, Users } from "lucide-react";
import styles from "./ReservationForm.module.css";

export default function ReservationForm() {
    const [formData, setFormData] = useState({
        guest_name: "",
        guest_phone: "",
        reservation_date: "",
        reservation_time: "",
        party_size: "2",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        const res = await fetch("/api/restaurant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            setMessage("Failed to submit reservation. Please try again.");
        } else {
            setMessage("Reservation request sent successfully! We will confirm shortly.");
            setFormData({
                guest_name: "",
                guest_phone: "",
                reservation_date: "",
                reservation_time: "",
                party_size: "2",
            });
        }
        setIsSubmitting(false);
    };

    return (
        <section className={styles.reservationSection}>
            <div className={styles.reservationContainer}>
                <div className={styles.formHeader}>
                    <h2>Reserve a Table</h2>
                    <p>Ensure your spot by booking ahead. Walk-ins are also welcome.</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="reservation-name">Name</label>
                            <input
                                id="reservation-name"
                                type="text"
                                required
                                placeholder="Your Full Name"
                                value={formData.guest_name}
                                onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="reservation-phone">Phone Number</label>
                            <input
                                id="reservation-phone"
                                type="tel"
                                required
                                placeholder="+91"
                                value={formData.guest_phone}
                                onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="reservation-date"><Calendar size={16} /> Date</label>
                            <input
                                id="reservation-date"
                                type="date"
                                required
                                value={formData.reservation_date}
                                onChange={(e) => setFormData({ ...formData, reservation_date: e.target.value })}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="reservation-time"><Clock4 size={16} /> Time</label>
                            <input
                                id="reservation-time"
                                type="time"
                                required
                                value={formData.reservation_time}
                                onChange={(e) => setFormData({ ...formData, reservation_time: e.target.value })}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="reservation-party-size"><Users size={16} /> Party Size</label>
                            <select
                                id="reservation-party-size"
                                value={formData.party_size}
                                onChange={(e) => setFormData({ ...formData, party_size: e.target.value })}
                            >
                                <option value="1">1 Person</option>
                                <option value="2">2 People</option>
                                <option value="3">3 People</option>
                                <option value="4">4 People</option>
                                <option value="5">5+ (Group)</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Book Table"}
                    </button>
                    {message && <p className={styles.message}>{message}</p>}
                </form>
            </div>
        </section>
    );
}
