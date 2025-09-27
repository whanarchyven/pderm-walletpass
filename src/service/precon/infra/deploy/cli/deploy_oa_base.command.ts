import { DeployService } from "@/src/service/precon/infra/deploy/deploy.service";

(async () => {
  const deploy = new DeployService();

  return deploy.deployServiceApp({
    name: "Deploy OA",
    hostname: "online.svetvz.com",
    generateRoutesToml: true,
    updateServerConfigs: true,
    instancePath:
      "/Users/nickerlan/ww/www/vpn/nick/shared/FHS/usr/src/node/ts/next/dist/cloudvps-by/ina/base_2_4",
    localBuildPathRelative: "dist/cloudvps-by/ina/base_2_4/var/www/next-app",
    remoteBuildPath: "/var/www/next-app",
    remoteServerAbsoluteDir: "/var/www",
    remoteServerIp: "185.251.38.148",
    remoteServerPemPath: `/Users/nickerlan/.ssh/id_rsa`,
    remoteServerUser: "root",
    desiredState: "deploy",
    includeGlobFilesPatterns: [
      "src/app/oa/**",
      "package.json",
      "tsconfig.json",
      "tailwind.config.js",
      "public/yandexlogo.png",
      "public/svz/**",
      "src/app/globals.css",
      "src/app/layout.tsx",
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
