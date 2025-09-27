import { NextResponse } from "next/server";
import { S3Service } from "@/src/service/precon/ext/s3/s3.service";
import { pre_ext_s3_$metaforest_mcs_cloudstore } from "@/src/service/precon/ext/s3/s3.pre.config";
import { mkdir, stat, unlink, writeFile } from "fs/promises";
import path from "path";
import * as fs from "fs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();

  const file = form.get("file") as File;
  if (!file) {
    return NextResponse.json(
      { error: "File blob is required." },
      { status: 400 }
    );
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const service = new S3Service(pre_ext_s3_$metaforest_mcs_cloudstore);

  const uploadDir = path.join(
    process.cwd(),
    `public/tmp/${Date.now().toString()}`
  );
  try {
    await stat(uploadDir);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error(
        "Error while trying to create directory when uploading a file\n",
        e
      );
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }
  }

  try {
    const filename = `${Date.now().toString()}-${file.name}`;
    const path = `${uploadDir}/${filename}`;

    await writeFile(path, buffer);
    const upl = await service.uploadPublicFile({
      dataBuffer: fs.readFileSync(path),
      filename,
      hideWithUuid: false,
    });
    await unlink(path);
    return NextResponse.json({ url: upl.Location?.replace("http:", "https:") });
  } catch (e) {
    console.error("Error while trying to upload a file\n", e);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }

  return NextResponse.json("ok");
}
