/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['52.66.205.31'], // Add your image domains
    unoptimized: true
  },
  experimental: {
    // Disable experimental features that might cause worker issues
    webpackBuildWorker: false,
    parallelServerCompiles: false,
    parallelServerBuildTraces: false
  }
}

module.exports = nextConfig