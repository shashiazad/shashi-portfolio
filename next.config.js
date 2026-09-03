/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Keep pdfjs-dist out of the webpack bundle — it needs its worker file
  // at runtime which webpack can't resolve for serverless environments
  experimental: {
    // Keep these out of the webpack bundle:
    // - pdfjs-dist needs its worker file at runtime
    // - edge-tts-universal / ws / bufferutil rely on native bindings that
    //   break when bundled ("bufferUtil.mask is not a function")
    serverComponentsExternalPackages: ['pdfjs-dist', 'edge-tts-universal', 'ws', 'bufferutil', 'utf-8-validate'],
  },
  webpack: (config) => {
    // pdfjs-dist optionally requires 'canvas' (native module not needed for text extraction)
    config.resolve.alias.canvas = false;
    return config;
  },
};
module.exports = nextConfig;
