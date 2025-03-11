/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: ["assets.coingecko.com", "icons.llama.fi", "icons.llamao.fi"],
  },
  // Ignore all TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Suppress output containing warnings
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 4,
  },
  webpack: (config, { dev, isServer }) => {
    // Only ignore errors in production build
    if (!dev) {
      config.optimization.minimizer = config.optimization.minimizer || [];
      // Ignore errors during minification
      config.optimization.emitOnErrors = false;
    }
    return config;
  },
};

export default config;