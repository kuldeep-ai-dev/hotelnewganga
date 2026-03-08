"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, LogIn, ChevronRight, Globe, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        console.time("login-request");
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            console.timeEnd("login-request");

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                console.log("Login successful, redirecting...");
                router.push("/admin");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.modularContainer}>
                {/* Left Side: Agency & Admin Branding */}
                <div className={styles.leftSide}>
                    <div className={styles.brandingModule}>
                        <p className={styles.welcomeText}>Welcome to Admin Panel</p>
                        <div className={styles.logoBox}>
                            <Image
                                src="/images/mediageny-logo.jpg"
                                alt="MediaGeny Logo"
                                width={300}
                                height={100}
                                className={styles.mediaGenyLogo}
                                priority
                            />
                        </div>
                        <h2 className={styles.techSolutions}>Powered by Mediageny tech solutions</h2>
                        <div className={styles.contactInfo}>
                            <a href="https://www.mediageny.com" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                                <Globe size={14} /> www.mediageny.com
                            </a>
                            <a href="mailto:support@mediageny.com" className={styles.contactLink}>
                                <Mail size={14} /> support@mediageny.com
                            </a>
                            <a href="tel:6002331851" className={styles.contactLink}>
                                <Phone size={14} /> +91 6002331851
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Side: Hotel Login Module */}
                <div className={styles.rightSide}>
                    <div className={styles.loginModule}>
                        <div className={styles.hotelBranding}>
                            <Image
                                src="/images/hng-logo.jpg"
                                alt="Hotel New Ganga Logo"
                                width={120}
                                height={120}
                                className={styles.hngLogo}
                                priority
                            />
                            <h1 className={styles.hotelName}>Hotel New Ganga</h1>
                        </div>

                        <form className={styles.form} onSubmit={handleLogin}>
                            <div className={styles.inputField}>
                                <label htmlFor="email">Email Address</label>
                                <div className={styles.inputWrapper}>
                                    <Mail size={20} className={styles.inputIcon} />
                                    <input
                                        id="email"
                                        type="email"
                                        className={styles.input}
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.inputField}>
                                <label htmlFor="password">Password</label>
                                <div className={styles.inputWrapper}>
                                    <Lock size={20} className={styles.inputIcon} />
                                    <input
                                        id="password"
                                        type="password"
                                        className={styles.input}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && <div className={styles.errorMsg}>{error}</div>}

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={loading}
                            >
                                {loading ? "Authenticating..." : (
                                    <>
                                        LOGIN TO DASHBOARD
                                        <ChevronRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
