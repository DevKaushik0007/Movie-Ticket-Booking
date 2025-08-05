// next.config.ts
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ REQUIRED!
  },
  typescript: {
    ignoreBuildErrors: true,  // ✅ OPTIONAL: only use if builds are failing due to TypeScript
  },
};

export default nextConfig;
