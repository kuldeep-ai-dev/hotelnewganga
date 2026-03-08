"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logoContainer}>
                    <Image
                        src="/images/hng-logo.jpg"
                        alt="Hotel New Ganga Logo"
                        width={45}
                        height={45}
                        className={styles.logoImg}
                        priority
                    />
                    <span className={styles.logoText}>Hotel New Ganga</span>
                </Link>
                <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileOpen : ""}`}>
                    <Link href="/" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link href="/rooms" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Rooms & Suites</Link>
                    <Link href="/restaurant" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Restaurant</Link>
                    <Link href="/corporate" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Corporate</Link>
                    <Link href="/location" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Location</Link>
                    <Link href="/book" className={`btn btn-primary ${styles.bookBtn}`} onClick={() => setIsMobileMenuOpen(false)}>Book Now</Link>
                </div>
                <button
                    className={styles.mobileMenuBtn}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
        </nav>
    );
}
