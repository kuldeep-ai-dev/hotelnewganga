"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";

export default function TranslateButton() {
    const [pageUrl, setPageUrl] = useState("");

    useEffect(() => {
        // Capture exact window URL upon client-side mount
        setPageUrl(window.location.href);
    }, []);

    // Fail gracefully if not hydrated yet
    if (!pageUrl) return null;

    // Direct Google Web Proxy to auto-translate the captured URL from English (en) to Assamese (as)
    const googleTranslateUrl = `https://translate.google.com/translate?sl=en&tl=as&u=${encodeURIComponent(pageUrl)}`;

    return (
        <a 
            href={googleTranslateUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                backgroundColor: "#fffbeb", /* Subtle gold/yellow tint */
                color: "#92400e",
                borderRadius: "20px",
                fontSize: "0.9rem",
                fontWeight: "600",
                textDecoration: "none",
                border: "1px solid #fde68a",
                transition: "all 0.2sease-in-out",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#fef3c7";
                e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#fffbeb";
                e.currentTarget.style.transform = "translateY(0)";
            }}
            title="Read this article in Assamese"
        >
            <Languages size={16} /> 
            <span>Read in Assamese (অসমীয়া)</span>
        </a>
    );
}
