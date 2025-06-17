// next.config.ts
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
};

// Compose plugins: apply `withNextIntl`, then wrap with `withBundleAnalyzer`
const combinedConfig = withBundleAnalyzer(withNextIntl(baseConfig));

export default combinedConfig;
