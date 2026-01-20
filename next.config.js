/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },

}

module.exports = nextConfig
