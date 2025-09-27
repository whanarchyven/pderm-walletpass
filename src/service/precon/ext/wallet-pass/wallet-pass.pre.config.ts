import { WalletPassPreConfiguredServiceOptions } from "@/src/service/precon/ext/wallet-pass/wallet-pass.pre";
import { pre_db_datasource_$metaforest_mcs_pediatric_dermatology } from "@/src/service/precon/db/data-source/data-source.pre.config";

export const pre_ext_walletpass_$pediatric: WalletPassPreConfiguredServiceOptions =
  {
    serviceRoot: "https://ptq.pw/service/mfg/pediatric-dermatology/pass/",
    peer: {
      pre_db_entity_wallet_pass_user_data: {
        collectionName: "wallet_pass_user_data",
        dataSource: pre_db_datasource_$metaforest_mcs_pediatric_dermatology,
      },
    },
  };
