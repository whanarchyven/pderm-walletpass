export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { FfmpegService } from "@/src/service/precon/convert/ffmpeg/ffmpeg.service";

export async function GET() {
  await new FfmpegService().convertWebmToWav(
    process.cwd() + "/public/example.webm",
    process.cwd() + "/public/example.wav"
  );
  return NextResponse.json("ok");
}
