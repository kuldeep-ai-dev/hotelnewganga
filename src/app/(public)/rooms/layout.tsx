import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
    return await getSeoMetadata("/rooms");
}

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
