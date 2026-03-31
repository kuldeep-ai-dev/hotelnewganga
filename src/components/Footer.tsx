"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.col}>
                    <Link href="/" className={styles.logoContainer}>
                        <Image
                            src="/images/hng-logo.jpg"
                            alt="Hotel New Ganga Property Logo - Located near Nemcare & GMCH Hospital Guwahati"
                            width={55}
                            height={55}
                            className={styles.footerLogo}
                        />
                        <span className={styles.logoText}>Hotel New Ganga</span>
                    </Link>
                    <p className={styles.desc}>
                        Experience comfort and premium service at Bhangagarh, Guwahati. Your perfect stay near Nemcare Hospital and GMCH.
                    </p>
                </div>
                <div className={styles.col}>
                    <h3 className={styles.heading}>Quick Links</h3>
                    <ul className={styles.linkList}>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/rooms">Rooms & Suites</Link></li>
                        <li><Link href="/restaurant">Restaurant</Link></li>
                        <li><Link href="/blog">Hotel Blog</Link></li>
                        <li><Link href="/corporate">Corporate Stays</Link></li>
                        <li><Link href="/site-map">Sitemap</Link></li>
                    </ul>
                </div>
                <div className={styles.col}>
                    <h3 className={styles.heading}>Contact Us</h3>
                    <ul className={styles.contactList}>
                        <li>
                            <MapPin size={18} />
                            <span>3rd & 4th Floor, Kaiser Commercial Complex, Below Bhangagarh Bridge, GS Road, Guwahati</span>
                        </li>
                        <li>
                            <Phone size={18} />
                            <span>+91 7099017799</span>
                        </li>
                        <li>
                            <Mail size={18} />
                            <span>sales@hotelnewganga.in</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles.bottom}>
                <div className={styles.bottomContent}>
                    <p>&copy; {new Date().getFullYear()} Hotel New Ganga. All rights reserved.</p>
                    <div className={styles.socialLinks}>
                        <a href="https://www.instagram.com/hotelnewganga?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <Instagram size={20} />
                        </a>
                        <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <Facebook size={20} />
                        </a>
                    </div>
                </div>
                <p className={styles.credit}>
                    Made by <a href="https://www.mediageny.com" target="_blank" rel="noopener noreferrer">MediaGeny™</a>
                </p>
            </div>
        </footer>
    );
}
