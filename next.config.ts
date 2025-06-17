import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Create the Next.js plugin for next-intl
const withNextIntl = createNextIntlPlugin();

// Base Next.js config
const baseConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
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
