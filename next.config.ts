import type { NextConfig } from "next";

const nextConfig = {

  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; object-src 'none'; base-uri 'self'; worker-src 'self' blob:;"
          }
        ],
      },
    ];
  },
  // Force new build ID to bypass cache
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
