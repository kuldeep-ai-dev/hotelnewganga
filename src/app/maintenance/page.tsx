import styles from "./page.module.css";
import Image from "next/image";
import { Settings, Phone, Mail } from "lucide-react";

export default function MaintenancePage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <Settings className={styles.spinIcon} size={64} />
                </div>

                <h1 className={styles.title}>Site Under Maintenance</h1>

                <p className={styles.description}>
                    We are currently performing scheduled maintenance to improve your experience.
                    The website will be back online shortly. We apologize for any inconvenience.
                </p>

                <div className={styles.contactCard}>
                    <h3>Need to contact us urgently?</h3>
                    <div className={styles.contactMethods}>
                        <div className={styles.method}>
                            <Phone size={18} />
                            <span>+91 7099017799</span>
                        </div>
                        <div className={styles.method}>
                            <Mail size={18} />
                            <span>info@hotelnewganga.com</span>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <p>
                        Developed and Maintained by <br />
                        <a href="https://www.mediageny.com" target="_blank" rel="noopener noreferrer">
                            MediaGeny Tech Solutions
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
