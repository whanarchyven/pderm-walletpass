/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/wallet-pass/:path*",
        destination: "/mg/pderm/wallet-pass/:path*",
      },
    ];
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;