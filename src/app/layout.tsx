import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";

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
  title: "Hotel New Ganga | Premium Stays near Nemcare & GMCH Guwahati",
  description: "Experience comfort and premium service at Hotel New Ganga, Bhangagarh. Located near Nemcare Hospital and GMCH on G.S. Road, Guwahati. Ideal for medical transit, corporate, and family stays.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
