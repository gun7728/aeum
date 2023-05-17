/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images:{
    domains:['lh3.googleusercontent.com']
  },
  env:{
    NEXT_PUBLIC_MAP_KEY : process.env.NEXT_PUBLIC_MAP_KEY,
    ODSAY_KEY : process.env.ODSAY_KEY,
    TOUR_API_ECD_KEY : process.env.TOUR_API_ECD_KEY,
    TOUR_API_DCD_KEY : process.env.TOUR_API_DCD_KEY,
  },
}

module.exports = nextConfig
