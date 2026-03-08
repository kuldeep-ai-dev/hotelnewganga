"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Utensils, Clock, MapPin, Calendar, Clock4, Users } from "lucide-react";
import styles from "./page.module.css";

import { getMultipleSiteContent } from "@/lib/cms";

export default function RestaurantPage() {
    const [cms, setCms] = useState<Record<string, string>>({
        restaurant_banner: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80",
        restaurant_gallery_1: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
        restaurant_gallery_2: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
        restaurant_gallery_3: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
        restaurant_gallery_4: "https://images.unsplash.com/photo-1621510405574-0466453109db?auto=format&fit=crop&w=600&q=80"
    });
    const [formData, setFormData] = useState({
        guest_name: "",
        guest_phone: "",
        reservation_date: "",
        reservation_time: "",
        party_size: "2",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchCMS = async () => {
            const data = await getMultipleSiteContent([
                "restaurant_banner",
                "restaurant_banner",
                "restaurant_gallery_1",
                "restaurant_gallery_2",
                "restaurant_gallery_3",
                "restaurant_gallery_4"
            ]);
            if (Object.keys(data).length > 0) {
                setCms(prev => ({ ...prev, ...data }));
            }
        };
        fetchCMS();
    }, []);

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
        <main className={styles.main}>
            {/* Hero Section */}
            <section
                className={styles.hero}
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${cms.restaurant_banner})` }}
            >
                <div className={styles.heroContent}>
                    <h1 className="fade-in">Dining at Hotel New Ganga</h1>
                    <p className="fade-in">Experience authentic local flavors and continental classics in a warm, elegant setting.</p>
                </div>
            </section>

            {/* Info & Menu Highlights */}
            <section className={styles.infoSection}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        <div className={styles.infoCol}>
                            <h2>Culinary Excellence</h2>
                            <p>Our in-house restaurant offers a curated menu designed to satisfy every palate. Whether you are grabbing a quick continental breakfast before a meeting or enjoying a leisurely traditional Indian dinner after a hospital visit, our chefs prioritize quality, hygiene, and taste.</p>

                            <ul className={styles.infoList}>
                                <li><Clock size={20} className={styles.icon} /> <strong>Breakfast:</strong> 7:30 AM - 10:30 AM</li>
                                <li><Clock size={20} className={styles.icon} /> <strong>Lunch & Dinner:</strong> 12:30 PM - 10:30 PM</li>
                                <li><Utensils size={20} className={styles.icon} /> <strong>Room Service:</strong> 24 Hours Available</li>
                                <li><MapPin size={20} className={styles.icon} /> <strong>Nearby Alternatives:</strong> Kareem's (240m), Starbucks</li>
                            </ul>
                        </div>
                        <div className={styles.imageCol}>
                            <div className={styles.imageGrid}>
                                <Image src={cms.restaurant_gallery_1} alt="Restaurant Ambiance" width={300} height={300} className={styles.gridImg} />
                                <Image src={cms.restaurant_gallery_2} alt="Premium Dining" width={300} height={300} className={styles.gridImg} />
                                <Image src={cms.restaurant_gallery_3} alt="Gourmet Breakfast" width={300} height={300} className={styles.gridImg} />
                                <Image src={cms.restaurant_gallery_4} alt="Traditional Indian Thali" width={300} height={300} className={styles.gridImg} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reservation Form */}
            <section className={styles.reservationSection}>
                <div className={styles.reservationContainer}>
                    <div className={styles.formHeader}>
                        <h2>Reserve a Table</h2>
                        <p>Ensure your spot by booking ahead. Walk-ins are also welcome.</p>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label>Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Your Full Name"
                                    value={formData.guest_name}
                                    onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Phone Number</label>
                                <input
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
                                <label><Calendar size={16} /> Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.reservation_date}
                                    onChange={(e) => setFormData({ ...formData, reservation_date: e.target.value })}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label><Clock4 size={16} /> Time</label>
                                <input
                                    type="time"
                                    required
                                    value={formData.reservation_time}
                                    onChange={(e) => setFormData({ ...formData, reservation_time: e.target.value })}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label><Users size={16} /> Party Size</label>
                                <select
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
        </main>
    );
}
