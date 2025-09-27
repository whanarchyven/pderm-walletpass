import { walletPassPdermApp } from "@/src/app/mg/pderm/wallet-pass/wallet-pass-pderm.app";
import PagePassPediatricDermatologyClient from "@/src/app/mg/pderm/wallet-pass/[userUid]/page-client";

export const dynamic = "force-dynamic";
export default async function PagePassPediatricDermatology({
  params,
}: {
  params: Promise<{ userUid: string }>;
}) {
  const { userUid } = await params;
  const welcome = await walletPassPdermApp.getWelcome(userUid);
  console.log("welcome", welcome);
  console.log("userUid", userUid);
  if (!welcome) return null;
  return (
    <div>
      <PagePassPediatricDermatologyClient userUid={userUid} />
    </div>
  );
}
