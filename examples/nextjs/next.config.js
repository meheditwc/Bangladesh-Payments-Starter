/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the Arena live-preview host (and any host) in dev
  async headers() {
    return [{ source: '/(.*)', headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }] }];
  },
};
module.exports = nextConfig;
