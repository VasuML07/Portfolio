import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "https://preview-chat-970956eb-e282-4d5e-bb59-a8a8cef73d83.space-z.ai",
  ],
};

export default nextConfig;
