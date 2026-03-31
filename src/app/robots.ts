import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/m/"],
      },
    ],
    sitemap: "https://www.hotelnewganga.in/sitemap.xml",
  };
}
