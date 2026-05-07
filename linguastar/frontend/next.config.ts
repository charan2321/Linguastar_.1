import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Silence the "multiple lockfiles" turbopack root warning
  // @ts-ignore: turbopack.root is valid in Next.js 16
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },
  // Allow local network access for dev testing on mobile/other devices
  allowedDevOrigins: ['172.20.81.49'],
};

export default nextConfig;
