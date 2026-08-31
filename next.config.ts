import type { NextConfig } from "next";

// Increase event listener limit to suppress Gzip compression concurrency warning in Node.js
if (typeof process !== 'undefined' && typeof process.setMaxListeners === 'function') {
  process.setMaxListeners(30);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
