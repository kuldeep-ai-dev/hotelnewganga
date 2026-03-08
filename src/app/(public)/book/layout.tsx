import { getSeoMetadata } from "@/lib/seo";

export async function generateMetadata() {
    return await getSeoMetadata("/book");
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
    return children;
}
