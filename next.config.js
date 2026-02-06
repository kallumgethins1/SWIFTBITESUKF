
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  // 🔥 THIS FIXES THE BUILD TIMEOUT
  staticPageGenerationTimeout: 300, // seconds (5 minutes)

  images: {
    domains: ['stackfood.6am.one'],
  },
}
