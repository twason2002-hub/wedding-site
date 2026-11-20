import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Platform landing is the home page; the couple site lives at /tushar-babitta.
    return [{ source: "/", destination: "/wedding-invitations", permanent: false }];
  },
};

export default nextConfig;
