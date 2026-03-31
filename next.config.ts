import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // Optimise image formats for faster loading (WebP + AVIF)
    formats: ['image/avif', 'image/webp'],
    // Responsive breakpoints for srcSet generation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable compression for better TTFB
  compress: true,
  // Powered by header removal for security + smaller response
  poweredByHeader: false,
};

export default nextConfig;
