import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // @ts-ignore: turbopack is top-level in Next.js 16
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },
};

export default nextConfig;
