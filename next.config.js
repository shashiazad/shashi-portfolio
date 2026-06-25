/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Keep pdfjs-dist out of the webpack bundle — it needs its worker file
  // at runtime which webpack can't resolve for serverless environments
  experimental: {
    serverComponentsExternalPackages: ['pdfjs-dist'],
  },
  webpack: (config) => {
    // pdfjs-dist optionally requires 'canvas' (native module not needed for text extraction)
    config.resolve.alias.canvas = false;
    return config;
  },
};
module.exports = nextConfig;
