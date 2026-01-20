/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  async redirects() {
    return [
      // Redirect common variations and old URLs
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      // Handle trailing slashes consistently
      {
        source: '/documents/',
        destination: '/documents',
        permanent: true,
      },
      {
        source: '/images/',
        destination: '/images',
        permanent: true,
      },
      {
        source: '/videos/',
        destination: '/videos',
        permanent: true,
      },
      {
        source: '/audio/',
        destination: '/audio',
        permanent: true,
      },
      {
        source: '/archives/',
        destination: '/archives',
        permanent: true,
      },
      {
        source: '/ebooks/',
        destination: '/ebooks',
        permanent: true,
      },
      // Redirect old tool URLs if they existed
      {
        source: '/tools/:slug',
        destination: '/:slug',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
