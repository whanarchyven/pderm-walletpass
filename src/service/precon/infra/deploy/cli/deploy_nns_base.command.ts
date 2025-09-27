import { DeployService } from "@/src/service/precon/infra/deploy/deploy.service";

(async () => {
  const deploy = new DeployService();

  return deploy.deployServiceApp({
    name: "Basic Demo",
    hostname: "ptq.pw",
    localBuildPathRelative: "../../dist/vk/nns/base_2_4/var/www/testapp",
    remoteServerAbsoluteDir: "/var/www",
    remoteServerIp: "146.185.209.75",
    remoteServerPemPath: `/Users/nns/.ssh/id_rsa`,
    remoteServerUser: "ubuntu",
    desiredState: "deploy",
    includeGlobFilesPatterns: ["**/*"],
    excludeGlobFilesPatterns: [
      ".next",
      ".next/**/*",
      ".builds",
      "dist",
      "dist/**/*",
      "docs/**/*",
      "src/app/mg/smart-seller/**",
      "config/**/*",
      "pages/**/*",
      ".builds/**/*",
      "node_modules",
      "node_modules/**/*",
      ".vercel",
      ".vercel/**/*",
      ".idea",
      ".idea/**/*",
      ".git",
      ".git/**/*",
      ".DS_STORE",
      ".swc",
      ".swc/**/*",
      "id_rsa",
      "temp/**/*",
    ],
  });
})();
