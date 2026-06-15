import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://maps.googleapis.com https://*.googleapis.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://images.ctfassets.net https://downloads.ctfassets.net *.contentful.com https://images.unsplash.com https://*.googleapis.com https://*.gstatic.com;
  font-src 'self' data:;
  connect-src 'self' https://api.open-meteo.com https://*.googleapis.com https://*.google.com https://*.gstatic.com https://www.google-analytics.com https://analytics.google.com;
  frame-src 'self' https://*.google.com;
  media-src 'self' data: blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  // @ts-ignore
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "downloads.ctfassets.net",
      },
      // Fallback for any contentful assets if needed
      {
        protocol: "https",
        hostname: "*.contentful.com",
      }
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "date-fns"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self \"https://*.googleapis.com\"), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);

