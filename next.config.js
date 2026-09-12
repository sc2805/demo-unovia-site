/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from any domain (useful for future CMS integration)
    remotePatterns: [],
  },
  async redirects() {
    return [
      {
        source: "/dsckart",
        destination: "/dsc",
        permanent: true,
      },
      {
        source: "/dsckart/:path*",
        destination: "/dsc/:path*",
        permanent: true,
      },
      {
        source: "/dsc-kart",
        destination: "/dsc",
        permanent: true,
      },
      {
        source: "/dsc-kart/:path*",
        destination: "/dsc/:path*",
        permanent: true,
      },
      {
        source: "/dsc-sale",
        destination: "/dsc",
        permanent: true,
      },
      {
        source: "/dsc-sale/:path*",
        destination: "/dsc/:path*",
        permanent: true,
      },
      {
        source: "/dsc-services",
        destination: "/dsc",
        permanent: true,
      },
      {
        source: "/dsc-services/:path*",
        destination: "/dsc/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
