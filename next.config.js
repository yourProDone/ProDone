/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Export as static site

  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  trailingSlash: true,

  // Image config - only works for external images with static export
  images: {
    unoptimized: true,
  },

  // Security headers (optional, handled better via vercel.json)
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],

  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
    legacyBrowsers: false,
  },

  webpack: (config, { isServer }) => {
    // Optional: optimize for client
    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'; // Example
    }
    return config;
  },
};

module.exports = nextConfig;
