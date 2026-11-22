import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/wedding-invitations", permanent: false },
      // Old personal invitation URLs. Kept only so those links leave the public site.
      { source: "/tushar-babitta", destination: "/wedding-invitations/templates", permanent: true },
      { source: "/tushar-babitta/:path*", destination: "/wedding-invitations/templates", permanent: true },
      { source: "/dynamic-invitation", destination: "/wedding-invitations/templates", permanent: true },
      { source: "/dynamic-invitation/:path*", destination: "/wedding-invitations/templates", permanent: true },
      { source: "/invitation", destination: "/wedding-invitations/templates", permanent: true },
      { source: "/invitation/:path*", destination: "/wedding-invitations/templates", permanent: true },
    ];
  },
};

export default nextConfig;
