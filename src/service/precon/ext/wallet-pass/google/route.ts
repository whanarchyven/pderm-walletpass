import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET() {
  // const service = new GoogleWalletPassEventService(
  //   pre_ext_walletPass_google_$pderm
  // );
  // service.auth();
  // const result = service.createJwtNewObjects(
  //   service.config.ticket.issuerId,
  //   service.config.ticket.classSuffix,
  //   "test_user_7",
  //   { ticketHolderName: "Тест", qrCodeData: "Тест", personStatus: "Статус" }
  // );
  return NextResponse.json({ status: "ok" });
}
