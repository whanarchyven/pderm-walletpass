import { NextResponse } from "next/server";
import { GoogleWalletPassEventService } from "@/src/service/precon/ext/wallet-pass/google/google-wallet-pass-event.service";
import { pre_ext_walletPass_google_$pderm } from "@/src/service/precon/ext/wallet-pass/google/pre.config";
import { walletPassPdermApp } from "@/src/app/mg/pderm/wallet-pass/wallet-pass-pderm.app";

export const dynamic = "force-dynamic";
export async function GET(request, { params }) {
  const { userUid } = params;
  console.log("gogogel wallet get", userUid);
  const dts =
    await walletPassPdermApp.walletPassService.walletPassUserData.findOne({
      userUid,
    });

  if (!dts)
    return NextResponse.json({
      error: "Ошибка, данные пользователя отсутствуют",
    });
  const qrCodeData = dts.debugRawInput?.fields?.frontSide?.qrCodeData;
  const personName = dts.debugRawInput?.fields?.frontSide?.personName;
  const personStatus = dts.debugRawInput?.fields?.frontSide?.personStatus;
  if (!(qrCodeData && personStatus && personName))
    return NextResponse.json({
      error: "Ошибка, данные  отсутствуют",
      debugInfo: {
        qrCodeData,
        personName,
        personStatus,
      },
    });

  const service = new GoogleWalletPassEventService(
    pre_ext_walletPass_google_$pderm
  );
  console.log("created google service");
  service.auth();
  console.log("authorized");
  const result = service.createJwtNewObjects(
    service.config.ticket.issuerId,
    service.config.ticket.classSuffix,
    userUid,
    { ticketHolderName: personName, qrCodeData: qrCodeData, personStatus }
  );
  console.log("before result");
  return NextResponse.json({ status: "ok", result });
}
