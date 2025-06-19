import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Create the Next.js plugin for next-intl
const withNextIntl = createNextIntlPlugin();

// Base Next.js config
const baseConfig: NextConfig = {
  // Configure headers for better caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|js|css|mp4|woff2|woff|ttf)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:all*',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
  experimental: {
    // Optimize modern JavaScript features
    optimizePackageImports: ['@loadable/component'],
  },
  // Optimize bundle size
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            outputPath: 'static/models/',
            publicPath: '/_next/static/models/',
            name: '[name].[ext]',
          },
        },
      ],
    });
    // Production optimizations
    if (!dev && !isServer) {
      // Split chunks more aggressively
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 50000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: false,
          default: false,
          // Bundle core packages together
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\/]node_modules[\/](react|react-dom|next)[\/]/,
            priority: 40,
            enforce: true,
          },
          // Bundle common utilities
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
        },
      };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/en.php',
        destination: '/en',
        permanent: true,
      },
      {
        source: '/de.php',
        destination: '/de',
        permanent: true,
      },
      {
        source: '/index.php',
        destination: '/sq', // adjust if your default locale is different
        permanent: true,
      },
    ];
  }
};

// Compose plugins: apply `withNextIntl`, then wrap with `withBundleAnalyzer`
const combinedConfig = withBundleAnalyzer(withNextIntl(baseConfig));

export default combinedConfig;
