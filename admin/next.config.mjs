/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Avoid stale dev bundler cache issues with client route groups.
  experimental: {
    optimizePackageImports: ["react-icons"]
  }
};

export default nextConfig;
