import { DeployService } from "@/src/service/precon/infra/deploy/deploy.service";

(async () => {
  const deploy = new DeployService();

  return deploy.deployServiceApp({
    hostname: "none",
    localBuildPathRelative: "dist/local/bantgo",
    remoteBuildPath: "none",
    remoteServerAbsoluteDir: "/var/www",
    remoteServerIp: "none",
    remoteServerPemPath: `none`,
    remoteServerUser: "none",
    desiredState: "localBuild",
    includeGlobFilesPatterns: [
      "package.json",
      "tsconfig.json",
      "tailwind.config.js",
      "src/app/mg/bantgo/**",
      "public/bantgo/**",
      "src/app/globals.css",
      "src/app/layout.tsx",
      "src/app/page.md",
      "src/components/button-toggle/**",
      "src/service/precon/db/data-source/**",
      "src/service/precon/db/entity/**",
      // "src/service/precon/ext/yandex/login/**",
      // "src/service/precon/ext/yandex/market/**",
      // "src/service/precon/ext/email/dashamail/**",
      "src/service/precon/logger/fs/**",
      "src/service/precon/utils/jwt/**",
      "src/service/precon/Pre.ts",
      "src/service/utils/**",
    ],
    excludeGlobFilesPatterns: [
      "**/*.pre.config.ts",
      "**/pre.config.ts",
      "**/env",
      "**/env.local",
      // ".next",
      // ".next/**/*",
      // ".builds",
      // "dist",
      // "dist/**/*",
      // "config/**/*",
      // "pages/**/*",
      // ".builds/**/*",
      // "node_modules",
      // "node_modules/**/*",
      // ".vercel",
      // ".vercel/**/*",
      // ".idea",
      // ".idea/**/*",
      // ".git",
      // ".git/**/*",
      // ".DS_STORE",
      // ".swc",
      // ".swc/**/*",
      // "id_rsa",
    ],
    // copySingleFiles:[{
    //   from:"src/app/mg/smart-seller/env",
    //   to:"env.local"
    // }],
    // pruneOptions: [
    //   {
    //     filesPattern: "`**/pre.config.ts",
    //     includeVariablesWithPattern: "smartseller_prod",
    //   },
    // ],
  });
})();
