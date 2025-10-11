/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@lib': path.resolve(process.cwd(), 'lib'),
      '@models': path.resolve(process.cwd(), 'models'),
    };
    return config;
  },
};

export default nextConfig;
