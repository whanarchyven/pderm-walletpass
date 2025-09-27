import { glob } from "glob";
import * as fs from "fs/promises";

export const dynamic = "force-dynamic";
export class IntrospectCodeService {
  async listNonDynamicServices() {
    const targetFiles = glob.sync(process.cwd() + "/**/{route.ts,page.md}");
    // console.log(targetFiles);
    const matchingFiles = (
      await Promise.all(
        targetFiles.map((file) => {
          return fs.readFile(file).then((buffer) => {
            const content = buffer.toString();
            if (!content.includes('export const dynamic = "force-dynamic"')) {
              if (file.includes(".tsx") && content.match("use client"))
                return null;
              return file;
            }
            return null;
          });
        })
      )
    ).filter(Boolean);
    return matchingFiles;

    //     , (err, files) => {
    //   if (err) {
    //     console.error("Error while finding files:", err);
    //   } else {
    //     files.forEach((file) => {
    //       fs.readFile(file, "utf8", (err, content) => {
    //         if (err) {
    //           console.error("Error while reading file:", err);
    //         } else {
    //           if (!content.includes('const dynamic = "force-dynamic"')) {
    //             console.log("File without specified line:", path.resolve(file));
    //           }
    //         }
    //       });
    //     });
    //   }
    // });
  }
}
