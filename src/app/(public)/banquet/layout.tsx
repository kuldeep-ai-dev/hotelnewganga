import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
    return await getSeoMetadata("/restaurant");
}

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
    return children;
}
