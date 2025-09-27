import { PreConfiguredService } from "@/src/service/precon/Pre";
import {
  EntityDbPreConfiguredService,
  EntityDbPreConfiguredServiceOptions,
} from "@/src/service/precon/db/entity/entity.service";

import path from "path";
import { AppleWalletPkpassJsonType } from "@/src/service/precon/ext/wallet-pass/apple/types/pkpass-json.type";
import { AppleWalletPkpassFilesType } from "@/src/service/precon/ext/wallet-pass/apple/types/pkpass-files.type";

export interface WalletPassPreConfiguredServiceOptions {
  serviceRoot: string;
  peer: {
    pre_db_entity_wallet_pass_user_data: EntityDbPreConfiguredServiceOptions;
  };
}
export interface WalletPassUserDataModel {
  id: string;
  userUid: string;
  title: string; //Заголовок на странице
  description: string; //Абзац описания
  ctaButtonText: string; //текст кнопки призыва к действию
  applePkPassJson: AppleWalletPkpassJsonType; //Поля, специфичные для apple
  applePkPassFilesUrls: AppleWalletPkpassFilesType; //Поля, специфичные для apple
  applePassInstalledInstance: any; //То что прилетает от apple через webhook
  googlePayPassObject: any; //Поля, специфичные для Google Pay Passes
  googlePayPassInstanceId: any; //ID экземпляра Pass в Google Pay
  debugRawInput: any; //ID экземпляра Pass в Google Pay
}

export class WalletPassPreConfiguredService extends PreConfiguredService<WalletPassPreConfiguredServiceOptions> {
  walletPassUserData =
    new EntityDbPreConfiguredService<WalletPassUserDataModel>(
      this.config.peer.pre_db_entity_wallet_pass_user_data
    ).asMongoCollection();

  async upsertDebugRawInput(userUid: string, debugRawInput: any) {
    return this.walletPassUserData.findOneAndUpdate(
      { userUid },
      { $set: { userUid, debugRawInput } },
      { upsert: true }
    );
  }
  async upsertWelcome(
    userUid: string,
    welcome: {
      title: string; //Заголовок на странице
      description: string; //Абзац описания
      ctaButtonText: string; //текст кнопки призыва к действию})
    }
  ) {
    return this.walletPassUserData.findOneAndUpdate(
      { userUid },
      { $set: { userUid, ...welcome } },
      { upsert: true }
    );
  }
  async getWelcome(userUid: string) {
    console.log("[WalletPass] getWelcome by userUid:", userUid);
    return this.walletPassUserData.findOne(
      { userUid },
      { projection: { title: 1, description: 1, ctaButtonText: 1, userUid: 1 } }
    );
  }
  async getUserData(userUid: string) {
    // console.log(this.config.peer.pre_db_entity_wallet_pass_user_data);
    return await this.walletPassUserData.findOne({ userUid });
  }

  async setPassInfo(
    userUid: string,
    passInfo: {
      applePkPassJson: AppleWalletPkpassJsonType;
      applePkPassFilesUrls: AppleWalletPkpassFilesType;
    }
  ) {
    return this.walletPassUserData.findOneAndUpdate(
      { userUid },
      {
        $set: {
          userUid,
          applePkPassJson: passInfo.applePkPassJson,
          applePkPassFilesUrls: passInfo.applePkPassFilesUrls,
        },
      },
      { upsert: true }
    );
  }

  async getLink(rawInput: any) {
    const { userUid } = rawInput;
    if (!userUid) throw "userUid not provided";

    await this.walletPassUserData.findOneAndUpdate(
      { userUid },
      { $set: { userUid, rawInput } },
      { upsert: true }
    );
    return path.join(this.config.serviceRoot, userUid);
  }
  async downloadApplePkPass(userUid: string) {
    const walletPassUserData = await this.walletPassUserData;
    const data = await walletPassUserData.findOne({ userUid });
    return data;
  }
}
