import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: "standalone",

  // Image optimization
  images: {
    // Allow external images from any CDN via env variables
    // Since CDN URLs are dynamic from env vars, disable optimization
    unoptimized: true,
  },

  // Enable compression
  compress: true,

  // Production source maps (optional, disable for security)
  productionBrowserSourceMaps: false,

  // React strict mode
  reactStrictMode: true,

  // Disable x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;
