/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  basePath: '/qimendunjia-lifa',
  assetPrefix: '/qimendunjia-lifa',
  trailingSlash: true,
}

module.exports = nextConfig
