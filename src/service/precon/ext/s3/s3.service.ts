import { PreConfiguredService } from "@/src/service/precon/Pre";

import { randomUUID } from "crypto";
import * as AWS from "aws-sdk";
const { S3 } = AWS;
import path from "path";

export interface S3ServiceOptions {
  accessKeyId: string;
  bucketName: string;
  secretKey: string;
  endpoint: string;
}

export class S3Service extends PreConfiguredService<S3ServiceOptions> {
  async uploadPublicFile(params: UploadPublicFile): Promise<FileUploadedData> {
    const s3 = new S3({
      endpoint: this.config.endpoint,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretKey,
      },
    });
    console.log("after new!!!");
    const cleanPrefix = params.prefix
      ? (params.prefix?.replace("/", "") ?? "") + "/"
      : "";
    const createUri = params.hideWithUuid
      ? `${cleanPrefix}${params.filename}/${randomUUID()}/${params.filename}`
      : path.join(params.prefix ?? "", params.filename);

    const res = await s3
      .upload({
        Bucket: this.config.bucketName,
        Body: params.dataBuffer,
        Key: createUri,
        ACL: "public-read",
      })
      .promise();
    return res as FileUploadedData;
  }
}

interface UploadPublicFile {
  dataBuffer: Buffer;
  filename: string;
  prefix?: string;
  hideWithUuid: boolean;
}
export interface FileUploadedData {
  ETag: string;
  Location: string;
  key: string;
  Key: string;
  Bucket: string;
}
