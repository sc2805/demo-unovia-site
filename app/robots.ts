import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dsc/admin"],
    },
    sitemap: "https://unovia.in/sitemap.xml",
  };
}
