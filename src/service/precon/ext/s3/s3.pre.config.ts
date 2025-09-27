import { S3ServiceOptions } from "@/src/service/precon/ext/s3/s3.service";

const pre_ext_s3_endpoint_$mcs: string = "https://hb.bizmrg.com";

export const pre_ext_s3_$metaforest_mcs_tts_audio: S3ServiceOptions = {
  endpoint: pre_ext_s3_endpoint_$mcs,
  accessKeyId: "eXsdJzqQjYC196zAZnZxaA",
  secretKey: "brHjtkrCbQmCihkBL1fuma3aPtt64Z2nCneHKdPHpXhE",
  bucketName: "tts_audio",
};

export const pre_ext_s3_$metaforest_mcs_cloudstore: S3ServiceOptions = {
  endpoint: pre_ext_s3_endpoint_$mcs,
  accessKeyId: "eXsdJzqQjYC196zAZnZxaA",
  secretKey: "brHjtkrCbQmCihkBL1fuma3aPtt64Z2nCneHKdPHpXhE",
  bucketName: "cloudstore",
};
