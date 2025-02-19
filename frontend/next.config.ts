import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /* for docker build */
  output: "standalone",

  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
};

export default nextConfig;
