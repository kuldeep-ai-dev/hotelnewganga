/**
 * JSON-LD Structured Data Components for SEO
 * Enables rich snippets in Google search results (star ratings, pricing, location pins)
 */

// --- Hotel / LodgingBusiness Schema (Homepage + all pages via layout) ---
export function HotelSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": "https://www.hotelnewganga.in/#hotel",
    "name": "Hotel New Ganga",
    "url": "https://www.hotelnewganga.in",
    "telephone": "+91-7099017799",
    "email": "info@hotelnewganga.com",
    "priceRange": "₹₹",
    "image": "https://www.hotelnewganga.in/images/black.png",
    "description":
      "Hotel New Ganga is a premium mid-market hotel on GS Road, Bhangagarh, Guwahati — just 5 minutes from Nemcare Hospital and GMCH. Ideal for medical visitors, corporate travellers, and families. AC rooms from ₹1286/night with free Wi-Fi, in-house restaurant, and 24/7 front desk.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress":
        "3rd & 4th Floor, Kaiser Commercial Complex, Below Bhangagarh Bridge, GS Road",
      "addressLocality": "Guwahati",
      "addressRegion": "Assam",
      "postalCode": "781005",
      "addressCountry": "IN",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 26.1565,
      "longitude": 91.7832,
    },
    "hasMap": "https://maps.google.com/?cid=18175016804919690260",
    "checkinTime": "12:00",
    "checkoutTime": "11:00",
    "starRating": {
      "@type": "Rating",
      "ratingValue": "3",
    },
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Free Wi-Fi", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "In-house Restaurant", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "24/7 Front Desk", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Room Service", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "CCTV Security", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Elevator", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Housekeeping", "value": true },
    ],
    "numberOfRooms": 20,
    "petsAllowed": false,
    "paymentAccepted": "Cash, Credit Card, UPI, Debit Card",
    "currenciesAccepted": "INR",
    "sameAs": [
      "https://www.instagram.com/hotelnewganga",
      "https://www.facebook.com/hotelnewganga",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// --- Restaurant Schema ---
export function RestaurantSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Hotel New Ganga Restaurant",
    "url": "https://www.hotelnewganga.in/restaurant",
    "telephone": "+91-7099017799",
    "servesCuisine": ["Indian", "Continental", "Multi-Cuisine"],
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress":
        "Kaiser Commercial Complex, GS Road, Bhangagarh",
      "addressLocality": "Guwahati",
      "addressRegion": "Assam",
      "postalCode": "781005",
      "addressCountry": "IN",
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
        ],
        "opens": "07:30",
        "closes": "22:30",
      },
    ],
    "menu": "https://www.hotelnewganga.in/restaurant",
    "acceptsReservations": true,
    "parentOrganization": {
      "@id": "https://www.hotelnewganga.in/#hotel",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// --- FAQ Schema (for Location page) ---
export function LocationFAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How far is Hotel New Ganga from Nemcare Hospital?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Hotel New Ganga is just 0.3 km (5-minute walk) from Nemcare Super Speciality Hospital, Bhangagarh, Guwahati.",
        },
      },
      {
        "@type": "Question",
        "name": "How far is Hotel New Ganga from GMCH (Guwahati Medical College)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Hotel New Ganga is approximately 0.6 km (6-minute walk) from Guwahati Medical College and Hospital (GMCH).",
        },
      },
      {
        "@type": "Question",
        "name": "What is the distance from Hotel New Ganga to Guwahati Airport?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "LGBI International Airport is approximately 22 km from Hotel New Ganga, about a 45-minute drive. Airport transfers can be arranged upon request.",
        },
      },
      {
        "@type": "Question",
        "name": "Does Hotel New Ganga offer rooms for medical attendants visiting Nemcare?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes, Hotel New Ganga specializes in accommodation for medical visitors and attendants visiting Nemcare Hospital and GMCH. We offer affordable AC rooms from ₹1286/night with 24/7 front desk and room service for your convenience.",
        },
      },
      {
        "@type": "Question",
        "name": "Does Hotel New Ganga have an in-house restaurant?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes, Hotel New Ganga features an in-house multi-cuisine restaurant serving breakfast (7:30 AM–10:30 AM), lunch and dinner (12:30 PM–10:30 PM), with 24-hour room service available.",
        },
      },
      {
        "@type": "Question",
        "name": "Is Hotel New Ganga suitable for corporate stays?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Absolutely. Hotel New Ganga offers corporate rates, bulk booking discounts, GST-compliant invoicing, laptop-friendly workspaces, and high-speed Wi-Fi — ideal for business travelers, medical representatives, and corporate teams visiting Guwahati.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// --- BreadcrumbList Schema ---
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
