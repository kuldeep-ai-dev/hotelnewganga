"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, CalendarCheck, Utensils, Briefcase, Settings, LogOut, Bed, Image as ImageIcon, Plug, Server, PenTool, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./layout.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            console.log("AdminLayout: Checking session for path:", pathname);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session && pathname !== "/admin/login") {
                console.log("AdminLayout: No session, redirecting to login");
                router.push("/admin/login");
            } else {
                console.log("AdminLayout: Session verified or on login page");
                setLoading(false);
            }
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("AdminLayout: Auth state change event:", _event);
            if (!session && pathname !== "/admin/login") {
                router.push("/admin/login");
            } else if (session && pathname === "/admin/login") {
                console.log("AdminLayout: Session detected on login page, redirecting to dashboard");
                router.push("/admin");
            }
        });

        return () => subscription.unsubscribe();
    }, [pathname, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    if (loading && pathname !== "/admin/login") {
        return <div className={styles.loadingOverlay}>Verifying session...</div>;
    }


    const navItems = [
        { name: "Room Bookings", path: "/admin", icon: <CalendarCheck size={20} /> },
        { name: "Rooms Management", path: "/admin/rooms", icon: <Bed size={20} /> },
        { name: "Site CMS", path: "/admin/cms", icon: <ImageIcon size={20} /> },
        { name: "Blog System", path: "/admin/blogs", icon: <PenTool size={20} /> },
        { name: "Lead Center", path: "/admin/leads", icon: <Users size={20} /> },
        { name: "Table Reservations", path: "/admin/restaurant", icon: <Utensils size={20} /> },
        { name: "Corporate Inquiries", path: "/admin/corporate", icon: <Briefcase size={20} /> },
        { name: "PMS Config", path: "/admin/pms", icon: <Plug size={20} /> },
        { name: "SEO Management", path: "/admin/seo", icon: <Settings size={20} /> },
        { name: "System Settings", path: "/admin/settings", icon: <Server size={20} /> },
    ];

    // If login page, don't show sidebar
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className={styles.adminLayout}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>HNG Admin</div>
                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.navLink} ${pathname === item.path ? styles.active : ""}`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className={styles.sidebarFooter}>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h2>Dashboard</h2>
                    <div className={styles.user}>Admin User</div>
                </header>
                <div className={styles.contentArea}>
                    {children}
                </div>
            </main>
        </div>
    );
}
