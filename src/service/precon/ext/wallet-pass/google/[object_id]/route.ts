import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(request, { params }) {
  // const service = new GoogleWalletPassEventService(
  //   pre_ext_walletPass_google_$pderm
  // );
  // service.auth();
  // const result = service.createJwtNewObjects(
  //   service.config.ticket.issuerId,
  //   service.config.ticket.classSuffix,
  //   params.object_id
  // );
  return NextResponse.json({ status: "ok", params });
}
