import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-auth", "@prisma/client"],
  turbo: {},
  experimental: {},
};

export default nextConfig;
