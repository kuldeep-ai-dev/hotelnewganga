"use client";

import { useState } from "react";
import { Calendar, User, Mail, Phone, Home } from "lucide-react";
import styles from "./page.module.css";

interface Room {
    id: string;
    name: string;
}

interface BookingFormProps {
    rooms: Room[];
    defaultRoomId?: string;
}

function BookingForm({ rooms, defaultRoomId }: BookingFormProps) {
    const initialRoom = defaultRoomId || (rooms[0]?.id ?? "");

    const [formData, setFormData] = useState({
        guest_name: "",
        guest_email: "",
        guest_phone: "",
        room_category: initialRoom,
        check_in: "",
        check_out: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        const selectedRoom = rooms.find((r) => r.id === formData.room_category);
        const roomName = selectedRoom ? selectedRoom.name : formData.room_category;

        const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, room_category: roomName }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            setMessage(`Failed: ${err.error || "Please try again."}`);
        } else {
            setMessage("Booking request sent successfully! We will confirm your reservation shortly.");
            setFormData({
                guest_name: "",
                guest_email: "",
                guest_phone: "",
                room_category: initialRoom,
                check_in: "",
                check_out: "",
            });
        }
        setIsSubmitting(false);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {/* Personal Info */}
            <div className={styles.formSection}>
                <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                        <label><User size={16} /> Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.guest_name}
                            onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                        />
                    </div>
                </div>

                <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                        <label><Mail size={16} /> Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.guest_email}
                            onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label><Phone size={16} /> Phone Number</label>
                        <input
                            type="tel"
                            required
                            value={formData.guest_phone}
                            onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <hr className={styles.divider} />

            {/* Booking Info */}
            <div className={styles.formSection}>
                <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                        <label><Home size={16} /> Room Category</label>
                        <select
                            value={formData.room_category}
                            onChange={(e) => setFormData({ ...formData, room_category: e.target.value })}
                        >
                            {rooms.length > 0 ? (
                                rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))
                            ) : (
                                /* Fallback if DB is empty */
                                <>
                                    <option value="deluxe">Deluxe Room</option>
                                    <option value="superior">Superior Room</option>
                                    <option value="superior-triple">Superior Triple Room</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>

                <div className={styles.inputRow}>
                    <div className={styles.inputGroup}>
                        <label><Calendar size={16} /> Check-in Date</label>
                        <input
                            type="date"
                            required
                            value={formData.check_in}
                            onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label><Calendar size={16} /> Check-out Date</label>
                        <input
                            type="date"
                            required
                            value={formData.check_out}
                            onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                </button>
            </div>

            {message && <p className={styles.message}>{message}</p>}
        </form>
    );
}

export default BookingForm;
