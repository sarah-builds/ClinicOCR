/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // tesseract.js and tesseract.js-core must run as server-side externals
  serverExternalPackages: ['tesseract.js', 'tesseract.js-core'],
  outputFileTracingIncludes: {
    '/**': [
      './node_modules/tesseract.js-core/**/*',
      './eng.traineddata',
    ],
  },
};

export default nextConfig;

