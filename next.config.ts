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
};

export default nextConfig;
