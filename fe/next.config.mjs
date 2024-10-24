/** @type {import('next').NextConfig} */

const nextConfig = {
  sassOptions: {
    additionalData: '@import "./src/styles/_variables.scss";',
  },
  images: {
    domains: ["picsum.photos"],
  },
};

export default nextConfig;
