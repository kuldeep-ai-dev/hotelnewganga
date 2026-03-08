"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, X, Clock, Mail, Trash2, CalendarOff } from "lucide-react";
import styles from "./page.module.css";

export default function AdminBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const fetchBookings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("bookings")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) console.error("Admin Fetch Error:", error);
        if (data) setBookings(data);
        setLoading(false);
    };

    const confirmBooking = async (id: string) => {
        setActionLoading(id);
        const res = await fetch("/api/admin/confirm-booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId: id }),
        });
        const data = await res.json();
        if (res.ok) {
            showToast(`✅ Booking confirmed! ${data.message}`);
            fetchBookings();
        } else {
            showToast(`❌ Error: ${data.error}`, "error");
        }
        setActionLoading(null);
    };

    const cancelBooking = async (id: string) => {
        setActionLoading(id);
        const { error } = await supabase
            .from("bookings")
            .update({ status: "cancelled" })
            .eq("id", id);
        if (!error) {
            showToast("Booking cancelled.");
            fetchBookings();
        } else {
            showToast("Failed to cancel booking.", "error");
        }
        setActionLoading(null);
    };

    const handleClearCanceled = async () => {
        console.log("Clear canceled button clicked!");
        setActionLoading("clear");
        try {
            console.log("Fetching /api/admin/clear-canceled...");
            const res = await fetch("/api/admin/clear-canceled", { method: "POST" });
            const data = await res.json();
            console.log("Clear canceled response:", data);

            if (res.ok) {
                showToast(`✅ ${data.message || "All cancelled bookings removed."}`);
                fetchBookings();
            } else {
                showToast(`❌ Error: ${data.error}`, "error");
            }
        } catch (err) {
            console.error("Clear canceled error:", err);
            showToast("❌ Failed to clear bookings.", "error");
        }
        setActionLoading(null);
    };

    const handleClearAll = async () => {
        if (!confirm("Are you REALLY sure you want to permanently delete ALL bookings from the database? This cannot be undone.")) return;

        console.log("Clear all button clicked!");
        setActionLoading("clear");
        try {
            console.log("Fetching /api/admin/clear-all...");
            const res = await fetch("/api/admin/clear-all", { method: "POST" });
            const data = await res.json();
            console.log("Clear all response:", data);

            if (res.ok) {
                showToast(`✅ ${data.message || "All bookings removed."}`);
                fetchBookings();
            } else {
                showToast(`❌ Error: ${data.error}`, "error");
            }
        } catch (err) {
            console.error("Clear all error:", err);
            showToast("❌ Failed to clear all bookings.", "error");
        }
        setActionLoading(null);
    };


    return (
        <div className={styles.container}>
            <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Room Bookings</h1>
                    <p>Manage all room reservation requests from the website.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            alert("Click registered! Executing clear...");
                            handleClearCanceled();
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s', zIndex: 100 }}
                    >
                        <Trash2 size={16} /> Clear Canceled
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            alert("Click registered! Executing clear all...");
                            handleClearAll();
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s', zIndex: 100 }}
                    >
                        <Trash2 size={16} /> Clear All Bookings
                    </button>
                </div>
            </header>

            {loading ? (
                <div className={styles.loading}>Loading bookings...</div>
            ) : bookings.length === 0 ? (
                <div className={styles.empty}>No bookings found.</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Guest Details</th>
                                <th>Room Type</th>
                                <th>Dates</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>
                                        <div className={styles.guestInfo}>
                                            <strong>{booking.guest_name}</strong>
                                            <span>{booking.guest_phone}</span>
                                            <span>{booking.guest_email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.roomType}>{booking.room_category}</span>
                                    </td>
                                    <td>
                                        <div className={styles.dates}>
                                            <span><strong>In:</strong> {new Date(booking.check_in).toLocaleDateString()}</span>
                                            <span><strong>Out:</strong> {new Date(booking.check_out).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[booking.status]}`}>
                                            {booking.status === 'pending' && <Clock size={14} />}
                                            {booking.status === 'confirmed' && <Check size={14} />}
                                            {booking.status === 'cancelled' && <X size={14} />}
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        {booking.status === 'pending' && (
                                            <div className={styles.actions}>
                                                <button
                                                    onClick={() => confirmBooking(booking.id)}
                                                    disabled={actionLoading === booking.id}
                                                    className={`${styles.actionBtn} ${styles.confirmBtn}`}
                                                    title="Confirm & Send Email"
                                                >
                                                    {actionLoading === booking.id ? "..." : <><Check size={16} /> <Mail size={14} /></>}
                                                </button>
                                                <button
                                                    onClick={() => cancelBooking(booking.id)}
                                                    disabled={actionLoading === booking.id}
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

            {/* Toast notification */}
            {toast && (
                <div style={{
                    position: "fixed",
                    bottom: "24px",
                    right: "24px",
                    background: toast.type === "success" ? "#166534" : "#991b1b",
                    color: "#fff",
                    padding: "14px 22px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    fontSize: "14px",
                    fontWeight: 500,
                    maxWidth: "400px",
                    zIndex: 9999,
                }}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}

