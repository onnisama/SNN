import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  agentRules: false,
  experimental: {
    // Next's detached TypeScript CLI process loses captured stdout in this Linux environment.
    // The compiler API performs the same type-check without spawning that subprocess.
    useTypeScriptCli: false,
  },
};

export default nextConfig;
