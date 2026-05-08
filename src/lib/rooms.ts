/**
 * Utilities for room-related data and image mappings.
 */

/**
 * Returns the best local cover image for a given room name.
 * Used for consistency across the public website.
 */
export function getRoomCoverImage(roomName: string): string {
    const n = (roomName || "").toLowerCase().trim();

    // Check for Super Deluxe
    if (n.includes("super deluxe") || n.includes("super")) {
        return "/images/hotel/rooms-gallery/super_deluxe/IMG_6682.JPG";
    }

    // Check for Premium Standard / Standard Premium
    if (n.includes("premium standard") || n.includes("standard premium") || n.includes("premium")) {
        return "/images/hotel/rooms-gallery/standard_premium/IMG_6548.JPG";
    }

    // Check for Deluxe
    if (n.includes("deluxe")) {
        return "/images/hotel/rooms-gallery/premium_deluxe/IMG_6662.JPG";
    }

    // Check for Standard
    if (n.includes("standard")) {
        return "/images/hotel/rooms-gallery/standard/HNG(4).JPG";
    }

    // Generic Fallback
    return "/images/hotel/SUPER%20DELUXE/IMG20241223165936.jpg";
}
