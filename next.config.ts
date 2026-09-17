import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.GITHUB_ACTIONS ? "/PATRON" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
