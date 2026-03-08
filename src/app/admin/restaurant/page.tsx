"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, X, Clock } from "lucide-react";
import styles from "../page.module.css"; // Reuse existing styles

export default function AdminRestaurant() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("restaurant_reservations")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setReservations(data);
        }
        setLoading(false);
    };

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from("restaurant_reservations")
            .update({ status })
            .eq("id", id);

        if (!error) {
            fetchReservations();
        } else {
            alert("Failed to update status");
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Table Reservations</h1>
                <p>Manage all restaurant table requests from the website.</p>
            </header>

            {loading ? (
                <div className={styles.loading}>Loading reservations...</div>
            ) : reservations.length === 0 ? (
                <div className={styles.empty}>No reservations found.</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Guest Details</th>
                                <th>Date & Time</th>
                                <th>Party Size</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((res) => (
                                <tr key={res.id}>
                                    <td>
                                        <div className={styles.guestInfo}>
                                            <strong>{res.guest_name}</strong>
                                            <span>{res.guest_phone}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.dates}>
                                            <span>{new Date(res.reservation_date).toLocaleDateString()}</span>
                                            <span>{res.reservation_time}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.roomType}>{res.party_size} People</span>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[res.status]}`}>
                                            {res.status === 'pending' && <Clock size={14} />}
                                            {res.status === 'confirmed' && <Check size={14} />}
                                            {res.status === 'cancelled' && <X size={14} />}
                                            {res.status}
                                        </span>
                                    </td>
                                    <td>
                                        {res.status === 'pending' && (
                                            <div className={styles.actions}>
                                                <button
                                                    onClick={() => updateStatus(res.id, 'confirmed')}
                                                    className={`${styles.actionBtn} ${styles.confirmBtn}`}
                                                    title="Confirm"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(res.id, 'cancelled')}
                                                    className={`${styles.actionBtn} ${styles.cancelBtn}`}
                                                    title="Cancel"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
