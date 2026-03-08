import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
    return await getSeoMetadata("/location");
}

export default function LocationLayout({ children }: { children: React.ReactNode }) {
    return children;
}
