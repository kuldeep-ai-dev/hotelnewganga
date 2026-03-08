import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
    return await getSeoMetadata("/corporate");
}

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
    return children;
}
