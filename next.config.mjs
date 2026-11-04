/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Vercel Hobby includes only 5,000 image transformations per month.
    // Serve images as-is so this project never consumes that quota.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
}

export default nextConfig
