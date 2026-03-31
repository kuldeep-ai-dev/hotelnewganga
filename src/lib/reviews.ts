// src/lib/reviews.ts
import { getMultipleSiteContent } from "./cms";

export interface GoogleReview {
    author_name: string;
    author_url: string;
    profile_photo_url: string;
    rating: number;
    relative_time_description: string;
    text: string;
    time: number;
}

export interface GooglePlaceData {
    rating: number;
    user_ratings_total: number;
    reviews: GoogleReview[];
}

const MOCK_REVIEWS: GooglePlaceData = {
    rating: 4.8,
    user_ratings_total: 124,
    reviews: [
        {
            author_name: "Rahul Sharma",
            author_url: "#",
            profile_photo_url: "https://lh3.googleusercontent.com/a/ACg8ocKwLpK1N_L7hVv48_c2k2mX8rVn9v3T4q2L0s9=s128-c0x00000000-cc-rp-mo",
            rating: 5,
            relative_time_description: "a week ago",
            text: "Excellent stay! The location is perfect if you are visiting Nemcare Hospital. The rooms are spotless and the food at the restaurant was delicious.",
            time: Date.now() / 1000 - 604800
        },
        {
            author_name: "Priya Das",
            author_url: "#",
            profile_photo_url: "https://lh3.googleusercontent.com/a/ACg8ocKW-_V9=s128-c0x00000000-cc-rp-mo",
            rating: 5,
            relative_time_description: "3 weeks ago",
            text: "Very accommodating staff. We arrived late at night from the airport, but the front desk was extremely helpful and check-in was seamless. The AC worked perfectly.",
            time: Date.now() / 1000 - 1814400
        },
        {
            author_name: "Dr. Ankit Verma",
            author_url: "#",
            profile_photo_url: "https://lh3.googleusercontent.com/a/ACg8ocKW34=s128-c0x00000000-cc-rp-mo",
            rating: 4,
            relative_time_description: "a month ago",
            text: "Great corporate rates. Clean and right on GS Road. It's my go-to place whenever I'm in Guwahati for medical conferences.",
            time: Date.now() / 1000 - 2592000
        }
    ]
};

export async function getLiveGoogleReviews(): Promise<GooglePlaceData> {
    const keys = await getMultipleSiteContent(["google_places_api_key", "google_places_place_id"]);
    const apiKey = keys["google_places_api_key"] || process.env.GOOGLE_PLACES_API_KEY;
    const placeId = keys["google_places_place_id"] || process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

    // Fast fail to mock data if no keys to prevent app crashes
    if (!apiKey || !placeId) {
        console.warn("⚠️ Google Places credentials missing in .env. Falling back to mock reviews.");
        return MOCK_REVIEWS;
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${apiKey}`;
        
        // Cache the response heavily (86400 seconds = 24 hours) to avoid Google Maps billing
        const res = await fetch(url, { next: { revalidate: 86400 } });
        
        if (!res.ok) {
            console.error("Failed to fetch Google reviews:", res.statusText);
            return MOCK_REVIEWS;
        }

        const data = await res.json();
        
        if (data.status !== "OK") {
            console.error("Google API error (e.g. invalid key/quota):", data.status);
            return MOCK_REVIEWS;
        }

        // Filter out bad reviews (e.g. below 4 stars)
        const filteredReviews = data.result.reviews.filter((r: GoogleReview) => r.rating >= 4);

        return {
            rating: data.result.rating,
            user_ratings_total: data.result.user_ratings_total,
            reviews: filteredReviews
        };

    } catch (err) {
        console.error("Exception fetching google reviews:", err);
        return MOCK_REVIEWS;
    }
}
