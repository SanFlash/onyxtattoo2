import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  experimental: { cpus: 2 },
  async headers() {
    return [{source:'/:path*',headers:[
      {key:'X-Content-Type-Options',value:'nosniff'},
      {key:'X-Frame-Options',value:'SAMEORIGIN'},
      {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
      {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
      {key:'Content-Security-Policy',value:"frame-ancestors 'self'; base-uri 'self'; object-src 'none'"}
    ]}];
  }
};
export default config;
