/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production
  generateEtags: true, // Enable ETag generation
  swcMinify: true, // Use SWC minifier
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header
  trailingSlash: true, // For better caching with CDN
  staticPageGenerationTimeout: 1000, // Timeout for static page generation

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week cache for images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    ];

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // Enable server components and other modern features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    scrollRestoration: true,
    optimizeCss: true, // Enable CSS optimization
    optimizePackageImports: [ // Tree-shake unused exports
      'lucide-react',
      'react-icons',
      'framer-motion',
    ],
  },

  // Server external packages
  serverExternalPackages: ['nodemailer'],

  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Only add these plugins in production
    if (!dev) {
      // Enable module concatenation for better performance
      config.optimization.concatenateModules = true;
      
      // Enable scope hoisting
      if (config.optimization.splitChunks) {
        config.optimization.splitChunks.minSize = 20000;
        config.optimization.splitChunks.maxSize = 500000;
      }
    }

    // Client-side only configurations
    if (!isServer) {
      config.resolve.fallback = { fs: false, net: false, tls: false };
    }

    return config;
  },
};

// Only enable profiling in production
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}
