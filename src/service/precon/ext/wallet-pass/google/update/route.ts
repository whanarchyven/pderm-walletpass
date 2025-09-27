import { NextResponse } from "next/server";
import { GoogleWalletPassEventService } from "@/src/service/precon/ext/wallet-pass/google/google-wallet-pass-event.service";
import { pre_ext_walletPass_google_$pderm } from "@/src/service/precon/ext/wallet-pass/google/pre.config";

export const dynamic = "force-dynamic";
export async function GET() {
  const service = new GoogleWalletPassEventService(
    pre_ext_walletPass_google_$pderm
  );
  service.auth();
  const result = service.updateObject(
    service.config.ticket.issuerId,
    "test_user_3"
  );
  return NextResponse.json({ status: "ok", result });
}
