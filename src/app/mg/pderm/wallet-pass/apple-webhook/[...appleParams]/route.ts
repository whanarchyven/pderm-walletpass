import { AppleWalletPassPreConfiguredService } from "@/src/service/precon/ext/wallet-pass/apple/apple-wallet-pass.precon";
import { pre_ext_walletpass_apple_$pderm } from "@/src/service/precon/ext/wallet-pass/apple/pre.config";
import {NextResponse} from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: Request, { params }) {
  const { appleParams } = params;
  console.log(appleParams);
  return new NextResponse("ok get")

}

export async function POST(request: Request, { params }) {
  const { appleParams } = params;
  console.log("POST", appleParams);
  const { pushToken } = await request.json();
  return new AppleWalletPassPreConfiguredService(
    pre_ext_walletpass_apple_$pderm
  ).asNextResponseForProcessAppleWebhookOnPassInstall(appleParams, pushToken);
}
