import { AppleWalletPassPreConfiguredServiceOptions } from "@/src/service/precon/ext/wallet-pass/apple/apple-wallet-pass.precon";
import * as fs from "fs";
import path from "path";
import { pre_db_datasource_$metaforest_mcs_pediatric_dermatology } from "@/src/service/precon/db/data-source/data-source.pre.config";



export const pre_ext_walletpass_apple_$pderm: AppleWalletPassPreConfiguredServiceOptions =
  {
    type: "event",
    organizationName: "Nikolai Strakhov",
    teamIdentifier: "UNQ8TVT6LY",
    passTypeIdentifier: "pass.wallet.nickerlan",
    passFileUrl: path.join(
      process.cwd(),
      "src/service/precon/ext/wallet-pass/apple/apple-pass-event.pass"
    ),
    wwdr: fs
      .readFileSync(
        path.join(
          process.cwd(),
          "src/service/precon/ext/wallet-pass/apple/cert/nickerlan/wwdr4.pem"
        )
      )
      .toString(),
    signerCert: fs
      .readFileSync(
        path.join(
          process.cwd(),
          "src/service/precon/ext/wallet-pass/apple/cert/nickerlan/signerCert.pem"
        )
      )
      .toString(),
    signerKey: fs
      .readFileSync(
        path.join(
          process.cwd(),
          "src/service/precon/ext/wallet-pass/apple/cert/nickerlan/signerKey.pem"
        )
      )
      .toString(),
    signerKeyPassphrase: "12AVB@cw",
    peer: {
      registeredDeviceModel: {
        collectionName: "apple_registered",
        dataSource: pre_db_datasource_$metaforest_mcs_pediatric_dermatology,
      },
    },
  };
