/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // tesseract.js must run as a server-side external (native bindings)
  serverExternalPackages: ['tesseract.js'],
};

export default nextConfig;

