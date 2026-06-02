<<<<<<< HEAD
// next.config.ts
const nextConfig = {
  output: "export",
=======
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
>>>>>>> 7eca9d9 (Make new Changes)
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ REQUIRED!
  },
  typescript: {
    ignoreBuildErrors: true,  // ✅ OPTIONAL: only use if builds are failing due to TypeScript
  },
  devIndicators: false,
};

export default nextConfig;
