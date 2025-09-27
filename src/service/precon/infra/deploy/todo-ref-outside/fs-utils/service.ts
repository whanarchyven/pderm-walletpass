import * as fs from "node:fs";
import * as path from "node:path";
import { promisify } from "node:util";
import { glob } from "./index";

const copyFile = promisify(fs.copyFile);
const rename = promisify(fs.rename);
const readdir = promisify(fs.readdir);
const rmdir = promisify(fs.rmdir);
const stat = promisify(fs.stat);
const symlink = promisify(fs.symlink);
const unlink = promisify(fs.unlink);

export class FSUtils {
  allFilesInDir(
    dir: string,
    excludePatterns: string[],
    overrideIncludePattern?: string
  ) {
    if (!fs.existsSync(dir)) return [];
    return glob.sync(overrideIncludePattern ?? "**/*", {
      cwd: dir,
      dot: true,
      nodir: true,
      ignore: excludePatterns,
    });
  }
  allDirsInDir(
    dir: string,
    excludePatterns: string[],
    overrideIncludePattern?: string
  ) {
    if (!fs.existsSync(dir)) return [];
    return glob.sync(overrideIncludePattern ?? "**/", {
      cwd: dir,
      dot: true,
      // nodir: true,
      ignore: excludePatterns,
    });
  }

  getFilesList(
    srcPath: string,
    excludePatterns: string[],
    includePatterns = ["**/*"] as string[]
  ) {
    return glob.sync(includePatterns, {
      cwd: srcPath,
      dot: true,
      nodir: true,
      ignore: excludePatterns,
    });
  }
  async copyFiles(
    srcPath: string,
    destPath: string,
    excludePatterns: string[],
    includePatterns = ["**/*"] as string[]
  ): Promise<void> {
    const allFiles = glob.sync(includePatterns, {
      cwd: srcPath,
      dot: true,
      nodir: true,
      ignore: excludePatterns,
    });

    // console.log(`all files of src ${srcPath}`, allFiles);

    await Promise.all(
      allFiles.map(async (file) => {
        const srcFile = path.join(srcPath, file);
        const destFile = path.join(destPath, file);
        await fs.promises.mkdir(path.dirname(destFile), { recursive: true });
        await copyFile(srcFile, destFile);
      })
    );
  }

  async removeEmptyFolders(folderPath: string): Promise<void> {
    const items = await readdir(folderPath);
    if (!items.length) {
      await rmdir(folderPath);
      return;
    }
    await Promise.all(
      items.map(async (item) => {
        const itemPath = path.join(folderPath, item);
        const stats = await stat(itemPath);
        if (stats.isDirectory()) {
          await this.removeEmptyFolders(itemPath);
        }
      })
    );
  }

  async createSymlink(realDir: string, symlinkPath: string): Promise<void> {
    if (fs.existsSync(symlinkPath)) return;
    return symlink(realDir, symlinkPath);
  }

  async move(srcPath: string, destPath: string): Promise<void> {
    return rename(srcPath, destPath);
  }

  deleteFolderRecursiveSymlinkSafeSync(dirPath) {
    if (fs.existsSync(dirPath)) {
      fs.readdirSync(dirPath).forEach((file) => {
        const currentPath = path.join(dirPath, file);
        if (fs.lstatSync(currentPath).isSymbolicLink()) {
          // Удаляем символическую ссылку без удаления директории на которую она указывает
          fs.unlinkSync(currentPath);
        } else if (fs.statSync(currentPath).isDirectory()) {
          // Рекурсивно удаляем директорию
          this.deleteFolderRecursiveSymlinkSafeSync(currentPath);
        } else {
          // Удаляем файл
          fs.unlinkSync(currentPath);
        }
      });
      fs.rmdirSync(dirPath);
    }
  }
}
