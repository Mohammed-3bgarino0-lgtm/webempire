import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverActions: { bodySizeLimit: "2mb" }
  },
  outputFileTracingIncludes: {
    "/[locale]/blog": ["./src/content/blog/index.json"],
    "/[locale]/blog/[slug]": ["./src/content/blog/**/*.json"],
  },
};

export default nextConfig;
