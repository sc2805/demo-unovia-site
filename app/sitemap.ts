import { MetadataRoute } from "next";
import { SERVICES } from "@/lib/constants";
import { getAllSlugs } from "@/lib/dsc/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://unovia.in";
  const lastModified = new Date();

  // Core static marketing and store routes
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/dsc",
    "/dsc/track",
    "/tally-importer",
    "/insights",
    "/calculators/sip-lumpsum",
    "/daily-brief",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route === "/dsc" ? 0.95 : 0.8,
  }));

  // General service routes
  const serviceRoutes = SERVICES.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Individual DSC product pages
  const dscProductRoutes = getAllSlugs().map((slug) => ({
    url: `${baseUrl}/dsc/${slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...serviceRoutes, ...dscProductRoutes];
}
