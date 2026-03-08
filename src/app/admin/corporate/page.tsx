"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, MailOpen, Clock } from "lucide-react";
import styles from "../page.module.css"; // Reuse existing styles

export default function AdminCorporate() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("corporate_inquiries")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setInquiries(data);
        }
        setLoading(false);
    };

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from("corporate_inquiries")
            .update({ status })
            .eq("id", id);

        if (!error) {
            fetchInquiries();
        } else {
            alert("Failed to update status");
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Corporate Inquiries</h1>
                <p>Review business, group, and extended stay requests.</p>
            </header>

            {loading ? (
                <div className={styles.loading}>Loading inquiries...</div>
            ) : inquiries.length === 0 ? (
                <div className={styles.empty}>No corporate inquiries found.</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Company & Contact</th>
                                <th>Details</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.map((inq) => (
                                <tr key={inq.id}>
                                    <td>
                                        <div className={styles.guestInfo}>
                                            <strong>{inq.company_name}</strong>
                                            <span>{inq.contact_person}</span>
                                            <span>{inq.phone} • {inq.email}</span>
                                        </div>
                                    </td>
                                    <td style={{ maxWidth: "300px" }}>
                                        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)", whiteSpace: "pre-wrap" }}>
                                            {inq.details}
                                        </p>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${inq.status === 'pending' ? styles.pending : styles.confirmed}`}>
                                            {inq.status === 'pending' && <Clock size={14} />}
                                            {inq.status === 'reviewed' && <MailOpen size={14} />}
                                            {inq.status === 'contacted' && <Check size={14} />}
                                            {inq.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            {inq.status === 'pending' && (
                                                <button
                                                    onClick={() => updateStatus(inq.id, 'reviewed')}
                                                    className={`btn btn-outline`}
                                                    style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                                                >
                                                    Mark Reviewed
                                                </button>
                                            )}
                                            {inq.status !== 'contacted' && (
                                                <button
                                                    onClick={() => updateStatus(inq.id, 'contacted')}
                                                    className={`btn btn-primary`}
                                                    style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                                                >
                                                    Mark Contacted
                                                </button>
                                            )}
                                        </div>
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
