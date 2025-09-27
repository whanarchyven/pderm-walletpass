import { PreConfiguredService } from "@/src/service/precon/Pre";
import crypto from "crypto";

export interface HashServiceOptions {
  secret: string;
}
export class HashService extends PreConfiguredService<HashServiceOptions> {
  stringToHash(data: string, maxLength = 32) {
    const secret = this.config.secret;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(data);
    const hash = hmac.digest();
    return hash
      .toString("base64")
      .replace(/[^A-Za-z0-9]/g, "")
      .slice(0, maxLength);
  }
  challengeArray(hash: string, dataArray: string[], maxLength = 32) {
    return dataArray.find(
      (data) => this.stringToHash(data, maxLength) === hash
    );
  }
}
