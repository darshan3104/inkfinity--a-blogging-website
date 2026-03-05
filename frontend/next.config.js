/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [],
        // Allows base64 images via <img> tag without optimization issues
    },
    // Allow large base64 images in body
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
};

module.exports = nextConfig;
