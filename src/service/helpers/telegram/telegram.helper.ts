import axios from "axios";
import { Update } from "node-telegram-bot-api";
import { TmpFsService } from "../../precon/fs/tmp/tmp.fs.service";
// import { TmpFsService } from "../../precon/fs/tmp/tmp.fs.service";

export class TelegamHelper {
  constructor(private readonly token: string) {}
  async getUpdates(config = {}) {
    return (await axios
      .get(`https://api.telegram.org/bot${this.token}/getUpdates`, {
        params: config,
      })
      .then((d) => d.data)) as { ok: boolean; result: Update[] };
  }
  async getDirectDownloadLink(
    fileId: string,
  ) {
    const r = await axios
      .get(
        `https://api.telegram.org/bot${this.token}/getFile?file_id=${fileId}`
      )
      .then((d) => d.data);

    const path = r.result.file_path;

    // console.log("before tg dwl ");
    return `https://api.telegram.org/file/bot${this.token}/${path}`
  }
  async downloadFileAsBuffer(
    fileId: string,
    params = {
      useLocalCache: true,
    }
  ) {
    const tmpFs = new TmpFsService();
    if (await tmpFs.exists(fileId, "telegram.ogg"))
      {
        console.log('used cache')
        return tmpFs.read(fileId, "telegram.ogg");
      }

    const r = await axios
      .get(
        `https://api.telegram.org/bot${this.token}/getFile?file_id=${fileId}`
      )
      .then((d) => d.data);

    const path = r.result.file_path;

    console.log("before tg dwl ");
    const data = await axios
      .get(`https://api.telegram.org/file/bot${this.token}/${path}`, {
        responseType: "arraybuffer",
        headers: { "Access-Control-Allow-Origin": "*" },
      })
      .then((d) => d.data)
      .catch((e) => console.log(e.response.data));
    //   if (useLocalCache) {
    //     new TmpFsService().write(fileId,"telegram.ogg", data)
    //   }
    console.log("after dwl");
    return data;
  }
}
