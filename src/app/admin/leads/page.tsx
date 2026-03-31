import styles from "./page.module.css";
import { Users } from "lucide-react";
import LeadManagementTable from "./components/LeadManagementTable";

export default function LeadsDashboard() {
    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <Users size={32} className={styles.iconPrimary} />
                    <div className={styles.titleContent}>
                        <h1>Marketing Lead Center</h1>
                        <p>Process, update, and selectively download potential booking leads automatically captured via your site's public funnels.</p>
                    </div>
                </div>
            </div>

            <LeadManagementTable />
        </main>
    );
}
