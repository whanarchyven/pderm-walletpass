import { NextResponse } from "next/server";
import { AppleWalletPassPreConfiguredService } from "@/src/service/precon/ext/wallet-pass/apple/apple-wallet-pass.precon";

import { walletPassPdermApp } from "@/src/app/mg/pderm/wallet-pass/wallet-pass-pderm.app";
import { pre_ext_walletpass_apple_$pderm } from "@/src/service/precon/ext/wallet-pass/apple/pre.config";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { userUid } = params;
  const data = await walletPassPdermApp.getUserData(userUid);
  const dts =
    await walletPassPdermApp.walletPassService.walletPassUserData.findOne({
      userUid,
    });
  console.log("user1062", dts);
  if (!dts?.applePkPassJson || !dts?.applePkPassFilesUrls)
    return NextResponse.json("no data");
  const service = new AppleWalletPassPreConfiguredService(
    pre_ext_walletpass_apple_$pderm
  );
  const pass = await service.generatePass({
    // pkPassJson: dts.applePkPassJson,
    pkPassFilesUrls: dts.applePkPassFilesUrls,
    overrides: dts.debugRawInput,
  });
  // const pass = await service.generatePass();
  return new NextResponse(pass, { headers: service.getHeaders() });
  // return NextResponse.json({ ok: true });
  // return NextResponse.json("ok");
}
