import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/lowongan-kerja",
        destination: "/karier-usaha",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
