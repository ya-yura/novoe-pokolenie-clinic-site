import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "1";
const sitePrefix = "/novoe-pokolenie-clinic-site";

const nextConfig: NextConfig = {
  output: githubPages ? "export" : undefined,
  trailingSlash: githubPages,
  assetPrefix: githubPages ? `${sitePrefix}/` : undefined,
};

export default nextConfig;
