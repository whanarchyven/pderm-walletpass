import { NextResponse } from "next/server";
import { walletPassPdermApp } from "@/src/app/mg/pderm/wallet-pass/wallet-pass-pderm.app";

export const dynamic = "force-dynamic";

export async function GET() {
  // const service = new WalletPassPreConfiguredService(
  //   pre_ext_walletpass_$pediatric
  // );
  //
  // await service.getLink({ userUid: "test" });
  // const data = await service.downloadApplePkPass("test");
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const input = await request.json();
  const auth = "EifaiTh5IeGhoo3vra3aiZeiJae2oasu"
      // request.headers.get("Authorization") as string;
  console.log('here');
  return await walletPassPdermApp.createOrUpdateCardAsNextResponse(input, auth);
  //
  // const service = new WalletPassPreConfiguredService(
  //   pre_ext_walletpass_$pediatric
  // );
  //
  // await service.getLink({ userUid: "test" });
  // const data = await service.downloadApplePkPass("test");
  // return NextResponse.json({ ok: data });
}
