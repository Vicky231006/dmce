import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - Valid in Next.js 15 but types might be outdated
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    turbopack: false,
  },
};

export default nextConfig;
