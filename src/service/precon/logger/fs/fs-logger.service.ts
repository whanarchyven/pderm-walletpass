import { PreConfiguredService } from "@/src/service/precon/Pre";
import * as fs from "fs";
import path from "path";

export interface FsLoggerServiceOptions {
  logDir: string;
  enabled?: boolean;
}
export class FsLoggerService extends PreConfiguredService<FsLoggerServiceOptions> {
  log(name: string, line: string) {
    if (!this.config.enabled) return;
    const now = new Date();
    const dateStr = `/${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate()}/`;
    const time = now.toTimeString().split(" GMT")?.[0];
    const filePath = path.join(this.config.logDir, dateStr, name);
    const directoryPath = path.dirname(filePath);

    // Проверьте, существует ли директория, и создайте ее, если она не существует
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    fs.appendFileSync(filePath, `${time} ${line}\n`);
  }
}
