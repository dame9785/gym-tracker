import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'km2enl0expixao6h.public.blob.vercel-storage.com',
      },
    ],
  },
  allowedDevOrigins: ['192.168.1.169'],

  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
};

export default nextConfig;
