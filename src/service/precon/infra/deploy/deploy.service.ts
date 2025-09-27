import * as fs from "node:fs";
import path from "path";
import { FSUtils } from "@/src/service/precon/infra/deploy/todo-ref-outside/fs-utils/service";
import { ExecUtils } from "@/src/service/precon/infra/deploy/todo-ref-outside/exec-utils";
import { TraefikConfigGeneratorService } from "@/src/service/precon/infra/deploy/traefik/traefik-config-generator";
// const ExecUtils = {} as any;
//"dist/vk/nns/base_2_4/var/www/testapp"

interface DeployServiceOptions {
  name: string;
  hostname: string;
  instancePath: string;
  // serviceName: string;
  // serviceAppName: string;
  localBuildPathRelative: string;
  remoteBuildPath: string;

  remoteServerIp: string;
  remoteServerUser: string;
  remoteServerPemPath: string;
  remoteServerAbsoluteDir: string;

  pruneOptions?: any;
  desiredState: "justPrintFiles" | "localBuild" | "deploy";
  includeGlobFilesPatterns: string[];
  excludeGlobFilesPatterns: string[];

  generateRoutesToml: boolean;
  updateServerConfigs: boolean;
}
export class DeployService {
  async deployServiceApp({
    name = "Bad Name",
    updateServerConfigs = false,
    generateRoutesToml = false,
    hostname = "",
    instancePath = "",
    localBuildPathRelative = "/badPAth",
    remoteBuildPath = "/var/www/testapp",
    remoteServerIp = "146.185.209.75",
    remoteServerUser = "ubuntu",
    remoteServerPemPath = "/Users/nickerlan/.ssh/id_rsa",
    desiredState = "justPrintFiles",
    excludeGlobFilesPatterns = [
      ".next",
      ".next/**/*",
      ".builds",
      "dist",
      "dist/**/*",
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
    ],
    includeGlobFilesPatterns = ["*/**"],
  }: Partial<DeployServiceOptions>) {
    try {
      const nextDirRoot = process.cwd();
      const buildsDirInTheRoot = "dist";

      if (generateRoutesToml) {
        TraefikConfigGeneratorService.genRouteTomlSubdomain(
          instancePath,
          hostname
        );
      }
      const localBuildPathAbsolute = path.join(
        nextDirRoot,
        localBuildPathRelative
      );
      //  1. Проверка на наличие папки {buildsDirInTheRoot}
      if (!fs.existsSync(path.join(nextDirRoot, ".next")))
        throw `Директория ${".next"} не существует в данном корне,
        эта проверка нужна для того чтобы случайно не запустить деплой не оттуда`;

      console.log("✅ Мы в правильной директории");

      // // 2. Копирование файлов в localBuildPath
      // // ...

      // await new FSUtils().deleteFolderRecursiveSymlinkSafeSync(buildInDir);
      console.log(
        `⏳ Собираемся копировать файлы из \n${nextDirRoot} \nв \n${localBuildPathAbsolute} \n(кроме ${excludeGlobFilesPatterns?.join(
          ", "
        )})`
      );
      if (desiredState === "justPrintFiles") {
        const list = new FSUtils().getFilesList(
          nextDirRoot,
          excludeGlobFilesPatterns,
          includeGlobFilesPatterns
        );
        console.log(list.join("\n"));
        console.log(
          "Просто вывели список файлов для (include,exclude,list)",
          excludeGlobFilesPatterns,
          includeGlobFilesPatterns,
          list
        );
        return;
      }
      await new FSUtils().copyFiles(
        nextDirRoot,
        localBuildPathAbsolute,
        excludeGlobFilesPatterns,
        includeGlobFilesPatterns
      );
      console.log(`✅ Скопировали файлы`);

      // 3. Установка node_modules //ToDo: болванка заготовка
      // ...
      console.log(
        `⏳ Собираемся собирать в директории ${localBuildPathAbsolute}`
      );

      const localInstallPromise = ExecUtils.execInDir(
        localBuildPathAbsolute,
        "pnpm install"
      );

      console.log(`✅ Запустили установку`);

      const localInstall = await localInstallPromise;

      console.log(localInstall);

      const localBuildPromise = ExecUtils.execInDir(
        localBuildPathAbsolute,
        "pnpm build"
      );

      await localBuildPromise;

      console.log(`✅ Сделали локальный билд`);

      if (desiredState === "localBuild") {
        console.log("И этим завершили");
        return;
      }

      const rsyncPromise = new ExecUtils().rsyncProjectToRemote({
        includePatterns: [],
        excludePatterns: ["node_modules", ".next/cache/**"],
        remoteDest: "/var/www",
        remoteIp: remoteServerIp,
        remoteUser: remoteServerUser,
        localSrc: localBuildPathAbsolute,
        pathToPem: remoteServerPemPath,
      });

      await rsyncPromise;

      console.log(`✅ Залили все rsync-ом`);

      // const intallPromise = new ExecUtils().sshExec(
      //   `cd ${remoteBuildPath} && pnpm install && pnpm build`,
      //   {
      //     remoteIp: remoteServerIp,
      //     remoteUser: remoteServerUser,
      //     remoteDest: remoteBuildPath,
      //     pathToPem: remoteServerPemPath,
      //   }
      // );
      //
      // await intallPromise;
      //
      // console.log(`✅ pnpm install на удаленной машине`);

      if (updateServerConfigs) {
        const rsyncPromiseCopyTraefilConfig =
          new ExecUtils().rsyncProjectToRemote({
            includePatterns: [],
            excludePatterns: [],
            remoteDest: "/var/www",
            remoteIp: remoteServerIp,
            remoteUser: remoteServerUser,
            localSrc: path.join(instancePath, "/etc"),
            pathToPem: remoteServerPemPath,
          });

        await rsyncPromiseCopyTraefilConfig;

        const rsyncPromiseCopyPm2Config = new ExecUtils().rsyncProjectToRemote({
          includePatterns: [],
          excludePatterns: [],
          remoteDest: "/",
          remoteIp: remoteServerIp,
          remoteUser: remoteServerUser,
          localSrc: path.join(instancePath, "/var/infra"),
          pathToPem: remoteServerPemPath,
        });

        await rsyncPromiseCopyPm2Config;
      }

      // const pm2syncConfig = new ExecUtils().rsyncProjectToRemote({
      //   includePatterns: [],
      //   excludePatterns: [],
      //   remoteDest: "/var",
      //   remoteIp: props.remoteServerIp,
      //   remoteUser: props.remoteServerUser,
      //   localSrc:
      //     "/Users/nickerlan/dev/javascript/nanoservices/gpt/gpt-next-ns/config/infra-routes/ansible/init-var-infra/infra",
      //   pathToPem: props.remoteServerPemPath,
      // });
      //
      // await pm2syncConfig;
      // console.log(`✅ обновление pm2 config`);
      //
      const pm2restart = new ExecUtils().sshExec(
        `pm2 restart /var/infra/ecosystem.config.js`,
        {
          remoteIp: remoteServerIp,
          remoteUser: remoteServerUser,
          remoteDest: path.join(remoteBuildPath),
          pathToPem: remoteServerPemPath,
        }
      );
      await pm2restart;
      console.log(`✅ pm2 restart`);

      return;
      //⌛️Здесь будет возможность выгружать не весь рутовый сервис, а подмножества

      // const servicesList = this.getServiceListInDir(baseDir);
      // console.log(
      //   `Здесь есть сервисы ${servicesList.services.sort().join(", ")}`
      // );
      //
      // const currentService = this.findServiceInDir(baseDir, props.serviceName);
      //
      // const serviceRelativePath = currentService.path; //сервисы могут быть в подпапках
      // const serviceAppRelativePath = path.join(
      //   serviceRelativePath,
      //   "apps",
      //   props.serviceAppName
      // );
      //
      // if (!currentService.apps.includes(props.serviceAppName))
      //   throw `Такой app (${props.serviceAppName}) у сервиса (${props.serviceName}) не существует`;
      //
      // console.log(
      //   `✅ Нашли сервис ${currentService.serviceName} и его app ${props.serviceAppName} в ${serviceAppRelativePath}`
      // );

      // console.log(new FSUtils().allDirsInDir(baseDir, this.excludePatterns));

      // ⏳Вместо pages здесь будет подмножество из app и иная логика
      // 4. Копирование папки pages, относящейся к контексту
      // ...

      // await new FSUtils().copyFiles(
      //   path.join(buildInDir, serviceAppRelativePath, "pages"),
      //   path.join(buildInDir, "pages"),
      //   []
      // );
      //
      // console.log(`✅ Добавили pages`);

      // 5. Очистка неиспользуемого ts кода с помощью ts-prune
      // ...

      // 6. Удаление пустых файлов и папок
      // ...

      // 7. Чистка package.json на предмет лишних зависимостей
      // ...

      // 8. Очистка лишних скриптов
      // ...

      // 9. Добавление типового шаблона в pages/api/build-info.ts со сведениями о дате и времени сборки
      // ...

      // // 10. Параллельные задачи
      // const parallelTask1 = this.sendPackageJsonAndUpdateDependencies();
      // const parallelTask2 = this.buildAndSendPublic();
      //
      // await Promise.all([parallelTask1, parallelTask2]);
      //
      // // 11. Выполнение задач на удаленной машине после завершения обоих процессов
      // // ...

      return {
        success: true,
        message: "Deployment completed successfully.",
      };
    } catch (error) {
      console.error("❌", error);
      return {
        success: false,
        message: `Deployment failed: ${error}`,
      };
    }
  }

  private async sendPackageJsonAndUpdateDependencies(): Promise<void> {
    // Реализация отправки package.json и обновления зависимостей на удаленной машине
  }

  private async buildAndSendPublic(): Promise<void> {
    // Реализация локальной сборки и отправки содержимого public на удаленную машину
  }
  // private getServiceListInDir(dir: string) {
  //   const allFiles = new FSUtils().allFilesInDir(
  //     dir,
  //     [...this.excludePatterns, "apps"], //если внутри apps eсть другой index - так нельзя
  //     "*/**/jupiter.ts" //Признак сервиса
  //   );
  //   const servicesUnique = new Set();
  //   const servicesAll = [] as string[];
  //   const servicesAllWithPaths = [] as { serviceName: string; path: string }[];
  //   allFiles.forEach((file) => {
  //     // if (!file.match("service/*/apps/*")) return;
  //     const path = file.split("/");
  //     if (path.length < 2) return;
  //     const serviceName = path[path.length - 2];
  //     servicesUnique.add(serviceName);
  //     servicesAll.push(serviceName);
  //     servicesAllWithPaths.push({
  //       serviceName,
  //       path: file.replace(`/jupiter.ts`, ""),
  //     });
  //   });
  //
  //   if (servicesUnique.size === servicesAll.length)
  //     return {
  //       services: servicesAll,
  //       servicesAllWithPaths,
  //     };
  //   return {
  //     services: [...servicesUnique],
  //     duplicates: new ArrUtils().findDuplicates(servicesAll),
  //     servicesAllWithPaths,
  //   };
  // }
  //
  // private findServiceInDir(dir: string, serviceName: string) {
  //   const services = this.getServiceListInDir(dir);
  //   const found = services.servicesAllWithPaths.find(
  //     (s) => s.serviceName === serviceName
  //   );
  //   if (!found)
  //     throw `сервис ${serviceName} не найден, возможно отсутствует jupiter.ts в его корне`;
  //   const apps = fs.readdirSync(path.join(dir, found.path, "apps"));
  //   return {
  //     serviceName,
  //     path: found.path,
  //     apps,
  //   };
  // }

  // Дополнительные методы для выполнения задач на удаленной машине
  // ...
}
