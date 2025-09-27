import { WalletPassPdermAppOptions } from "@/src/app/mg/pderm/wallet-pass/wallet-pass-pderm.app";
import { pre_ext_walletpass_$pediatric } from "@/src/service/precon/ext/wallet-pass/wallet-pass.pre.config";

export const config_mg_pderm_walletPass_$basic: WalletPassPdermAppOptions = {
  bearerToken: "EifaiTh5IeGhoo3vra3aiZeiJae2oasu",
  serviceRootUrl: "https://pediatric-dermatology.vercel.app/mg/pderm/wallet-pass",
  peer: {
    pre_ext_walletpass: pre_ext_walletpass_$pediatric,
  },
};
