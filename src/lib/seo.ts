import { supabase } from "./supabase";
import type { Metadata } from "next";

const SITE_URL = "https://www.hotelnewganga.in";
const SITE_NAME = "Hotel New Ganga";
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hng-logo.jpg`;

/**
 * Per-page SEO defaults, following the MediaGeny audit recommendations.
 * These serve as fallbacks when the Supabase seo_metadata table has no entry.
 */
const PAGE_SEO: Record<
  string,
  {
    title: string;
    description: string;
    keywords: string;
  }
> = {
  "/": {
    title:
      "Hotel New Ganga Guwahati | Near Nemcare & GMCH Hospital — Premium Stays",
    description:
      "Stay at Hotel New Ganga — just 5 mins from Nemcare & GMCH in Bhangagarh, Guwahati. AC rooms from ₹1286/night. Free Wi-Fi, multi-cuisine restaurant & 24/7 front desk. Book direct and save.",
    keywords:
      "hotel near Nemcare Hospital Guwahati, hotel near GMCH Guwahati, hotel in Bhangagarh Guwahati, hotel on GS Road Guwahati, budget hotel Guwahati near hospital, medical accommodation Guwahati, Hotel New Ganga",
  },
  "/rooms": {
    title:
      "Hotel Rooms in Guwahati | Standard, Deluxe & Super Deluxe — Hotel New Ganga",
    description:
      "Choose from Standard, Deluxe or Super Deluxe rooms at Hotel New Ganga, Guwahati. Soundproofed, sanitised & near Nemcare Hospital. Rates from ₹1286. Book online now.",
    keywords:
      "AC rooms Guwahati, budget rooms near hospital Guwahati, deluxe room GS Road, hotel rooms Bhangagarh, rooms near Nemcare Hospital",
  },
  "/restaurant": {
    title:
      "Restaurant in Guwahati | Multi-Cuisine Dining — Hotel New Ganga",
    description:
      "Enjoy fresh multi-cuisine meals at Hotel New Ganga's in-house restaurant on GS Road, Guwahati. Open for breakfast, lunch & dinner. Room service available 24/7.",
    keywords:
      "restaurant in Guwahati GS Road, multi-cuisine dining Bhangagarh, restaurant near Nemcare Hospital Guwahati, hotel restaurant Guwahati",
  },
  "/corporate": {
    title:
      "Corporate Hotel Stays Guwahati | Business Rates — Hotel New Ganga",
    description:
      "Corporate accommodation in Guwahati at Hotel New Ganga. Business rates, laptop-friendly workspaces, Wi-Fi & CCTV security. Ideal for medical reps & executives. Enquire now.",
    keywords:
      "corporate hotels Guwahati, business hotel GS Road, corporate stays Guwahati, hotel for medical reps Guwahati, bulk booking hotel Guwahati",
  },
  "/location": {
    title:
      "Hotel New Ganga Location | Near Nemcare & GMCH, GS Road Guwahati",
    description:
      "Hotel New Ganga is located on GS Road, Bhangagarh, Guwahati — just 0.3 km from Nemcare Hospital and 0.6 km from GMCH. Easy access to airport, railway station & city attractions.",
    keywords:
      "hotel location Bhangagarh Guwahati, hotel near Nemcare Hospital, hotel near GMCH, GS Road hotel Guwahati, medical transit hotel Guwahati",
  },
  "/book": {
    title: "Book a Room | Hotel New Ganga — Direct Booking, Best Rates",
    description:
      "Book your stay at Hotel New Ganga, Guwahati directly and get the best rates. AC rooms near Nemcare Hospital from ₹1286/night. Instant confirmation.",
    keywords:
      "book hotel Guwahati, hotel booking near Nemcare, direct booking hotel Guwahati, affordable hotel Bhangagarh",
  },
};

export async function getSeoMetadata(path: string): Promise<Metadata> {
  const pageSeo = PAGE_SEO[path] || PAGE_SEO["/"];
  const canonicalUrl = `${SITE_URL}${path === "/" ? "" : path}`;

  // Try fetching from Supabase seo_metadata table first
  try {
    const { data, error } = await supabase
      .from("seo_metadata")
      .select("*")
      .eq("page_path", path)
      .single();

    if (!error && data) {
      return buildMetadata({
        title: data.meta_title || pageSeo.title,
        description: data.meta_description || pageSeo.description,
        keywords: data.keywords || pageSeo.keywords,
        canonicalUrl,
        path,
      });
    }
  } catch (err) {
    console.error("Failed to fetch SEO for path:", path);
  }

  // Fall back to hardcoded per-page SEO
  return buildMetadata({
    title: pageSeo.title,
    description: pageSeo.description,
    keywords: pageSeo.keywords,
    canonicalUrl,
    path,
  });
}

function buildMetadata(opts: {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  path: string;
}): Metadata {
  const { title, description, keywords, canonicalUrl } = opts;

  return {
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Hotel New Ganga — Premium Stays near Nemcare & GMCH, Guwahati",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
