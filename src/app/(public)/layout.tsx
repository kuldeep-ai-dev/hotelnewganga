import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import ExitIntentPopup from "@/components/ExitIntentPopup";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
            <WhatsAppWidget />
            <ExitIntentPopup />
        </>
    );
}
