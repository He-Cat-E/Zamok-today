/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.avs.io",
        pathname: "/explore/cities/**"
      }
    ]
  }
};

export default nextConfig;

