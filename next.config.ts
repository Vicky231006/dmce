import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - Valid in Next.js 15 but types might be outdated
  // devIndicators removed to fix type errors in Next.js 16
  // devIndicators: {
  //   turbopack: false,
  // },
};

export default nextConfig;
