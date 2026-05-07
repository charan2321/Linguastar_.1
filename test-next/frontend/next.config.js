import { loadEnvConfig } from '@next/env';
import path from 'path';

// Load env variables from the parent directory
loadEnvConfig(path.resolve(process.cwd(), '..'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    TEST_VAR: process.env.TEST_VAR,
  },
};
export default nextConfig;
