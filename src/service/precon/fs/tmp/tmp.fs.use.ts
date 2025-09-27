import { TmpFsServiceType } from "./tmp.fs.service";
import { createNextApiProxyHandler } from "@/src/service/exp/api-proxy/create-next-api-proxy-handler";

export const useTmpFsService = () =>
  createNextApiProxyHandler<TmpFsServiceType>("/service/precon/fs/tmp");
