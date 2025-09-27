import { TmpFsService } from "../../tmp.fs.service";
import { createNextApiProxyRoute } from "@/src/service/exp/api-proxy/create-next-api-proxy-route";

export const dynamic = "force-dynamic";

export const POST = createNextApiProxyRoute(TmpFsService);
