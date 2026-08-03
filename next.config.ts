import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = {
  output: githubPages ? "export" : undefined,
  trailingSlash: githubPages,
  assetPrefix: githubPages ? "/shale-sante-clinic-site/" : undefined,
};

export default nextConfig;
