import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import { HotelSchema } from "@/components/JsonLdSchema";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hotelnewganga.in"),
  title: {
    default: "Hotel New Ganga | Premium Stays near Nemcare & GMCH Guwahati",
    template: "%s | Hotel New Ganga",
  },
  description:
    "Experience comfort and premium service at Hotel New Ganga, Bhangagarh. Located near Nemcare Hospital and GMCH on G.S. Road, Guwahati. Ideal for medical transit, corporate, and family stays.",
  keywords:
    "Hotel New Ganga, hotel Guwahati, hotel near Nemcare, hotel near GMCH, GS Road hotel, Bhangagarh hotel, budget hotel Guwahati, medical accommodation Guwahati",
  authors: [{ name: "Hotel New Ganga" }],
  creator: "MediaGeny Tech Solutions",
  publisher: "Hotel New Ganga",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Hotel New Ganga",
    images: [
      {
        url: "/images/black.png",
        width: 1200,
        height: 630,
        alt: "Hotel New Ganga — Premium Stays near Nemcare & GMCH, Guwahati",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${playfair.variable} antialiased`}>
        <HotelSchema />
        {children}
      </body>
    </html>
  );
}
