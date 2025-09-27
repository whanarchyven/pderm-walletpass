export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { IntrospectCodeService } from "@/src/service/precon/code/introspect/introspect-code.service";

export async function GET() {
  const res = await new IntrospectCodeService().listNonDynamicServices();
  return NextResponse.json({ listNonDynamicServices: res });
}
