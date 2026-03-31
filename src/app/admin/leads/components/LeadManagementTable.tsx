"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Download, CheckCircle, Clock } from "lucide-react";
import styles from "../page.module.css";

interface Lead {
    id: string;
    contact_value: string;
    lead_type: string;
    status: string;
    created_at: string;
}

export default function LeadManagementTable() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("hotel_leads")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Failed to fetch leads:", error);
        } else {
            setLeads(data || []);
        }
        setIsLoading(false);
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "New" ? "Contacted" : "New";
        
        // Optimistic UI update
        setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));

        const { error } = await supabase
            .from("hotel_leads")
            .update({ status: newStatus })
            .eq("id", id);
            
        if (error) {
            console.error("Failed to update status:", error);
            // Revert on fail
            fetchLeads();
        }
    };

    const exportToCSV = () => {
        if (leads.length === 0) return;

        // Construct CSV Headers
        const headers = ["Timestamp", "Contact Information", "Lead Source", "Status"];
        
        // Map rows securely
        const csvRows = leads.map(lead => {
            const date = new Date(lead.created_at).toLocaleString('en-US');
            // Escape quotes inside fields dynamically
            return `"${date}","${lead.contact_value.replace(/"/g, '""')}","${lead.lead_type}","${lead.status}"`;
        });

        // Combine into single payload
        const csvContent = [headers.join(","), ...csvRows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        
        // Trigger forced invisible download
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `HNG_Leads_Export_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={styles.contentCard}>
            <div className={styles.tableHeader}>
                <h2>Active Funnel Leads ({leads.length})</h2>
                <button 
                    className={styles.exportBtn} 
                    onClick={exportToCSV}
                    disabled={leads.length === 0}
                    style={{ opacity: leads.length === 0 ? 0.5 : 1 }}
                >
                    <Download size={18} /> Export CSV
                </button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.leadsTable}>
                    <thead>
                        <tr>
                            <th>Date Captured</th>
                            <th>Contact Detail (Email / Phone)</th>
                            <th>Capture Funnel</th>
                            <th>Status Matrix</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className={styles.emptyState}>Loading proprietary lead data...</td>
                            </tr>
                        ) : leads.length === 0 ? (
                            <tr>
                                <td colSpan={5} className={styles.emptyState}>No leads have been captured by the funnels yet.</td>
                            </tr>
                        ) : (
                            leads.map((lead) => (
                                <tr key={lead.id}>
                                    <td>
                                        {new Date(lead.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td style={{fontWeight: 600}}>{lead.contact_value}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles.typeBadge}`}>
                                            {lead.lead_type}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.badge} ${lead.status === 'New' ? styles.statusNew : styles.statusContacted}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className={styles.actionBtn}
                                            onClick={() => toggleStatus(lead.id, lead.status)}
                                        >
                                            {lead.status === 'New' ? (
                                                <><CheckCircle size={16} /> Mark Contacted</>
                                            ) : (
                                                <><Clock size={16} /> Mark New</>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
