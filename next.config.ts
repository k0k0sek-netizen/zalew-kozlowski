import type { NextConfig } from "next";

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
};

export default nextConfig;
