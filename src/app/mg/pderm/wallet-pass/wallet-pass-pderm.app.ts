import { PreConfiguredService } from "@/src/service/precon/Pre";
import {
  CreateOrUpdateCardInput,
  ZodCreateOrUpdateCardInput,
} from "@/src/app/mg/pderm/wallet-pass/types/zodCreateOrUpdateCardInput";
import { config_mg_pderm_walletPass_$basic } from "@/src/app/mg/pderm/wallet-pass/app.config";
import { NextResponse } from "next/server";
import path from "path";
import {
  WalletPassPreConfiguredService,
  WalletPassPreConfiguredServiceOptions,
} from "@/src/service/precon/ext/wallet-pass/wallet-pass.pre";
import { AppleWalletPkpassFilesType } from "@/src/service/precon/ext/wallet-pass/apple/types/pkpass-files.type";

export interface WalletPassPdermAppOptions {
  bearerToken: string;
  serviceRootUrl: string;
  peer: {
    pre_ext_walletpass: WalletPassPreConfiguredServiceOptions;
  };
}
class WalletPassPdermApp extends PreConfiguredService<WalletPassPdermAppOptions> {
  walletPassService = new WalletPassPreConfiguredService(
    this.config.peer.pre_ext_walletpass
  );

  async getWelcome(userUid: string) {
    return this.walletPassService.getWelcome(userUid);
  }
  async createOrUpdateCardAsNextResponse(
    input: CreateOrUpdateCardInput,
    auth: string
  ) {
    const parse = ZodCreateOrUpdateCardInput.safeParse(input);

    // if (auth !== `Bearer ${this.config.bearerToken}`) {
    //   console.log(auth, `Bearer ${this.config.bearerToken}`);
    //   return new NextResponse(
    //     JSON.stringify({
    //       status: "error",
    //       error:
    //         "Wrong or missing Authorization header " + this.config.bearerToken,
    //     }),
    //     { status: 401 }
    //   );
    // }
    if (!parse.success) {
      return new NextResponse(
        JSON.stringify({ status: "error", error: parse.error.issues }),
        { status: 400 }
      );
    }

    const d2 = await this.walletPassService.upsertDebugRawInput(
      input.userUid,
      input
    );
    input.welcome &&
      (await this.walletPassService.upsertWelcome(
        input.userUid,
        input.welcome
      ));

    const d3 = await this.walletPassService.setPassInfo(input.userUid, {
      applePkPassJson: {
        ...(this.mapCreateOrUpdateCardInputToPkPassFields(input) as any),
      },
      applePkPassFilesUrls: this.mapCreateOrUpdateCardInputToFileUrls(input),
    });

    return NextResponse.json({
      status: "success",
      link: `${this.config.serviceRootUrl}/${input.userUid}`,
      debug: { d2, d3 },
      // tmpMap: this.mapCreateOrUpdateCardInputToPkPassFields(input),
    });
  }
  async getUserData(userUid: string) {
    await this.walletPassService.getUserData(userUid);
  }

  mapCreateOrUpdateCardInputToFileUrls(input: CreateOrUpdateCardInput) {
    const pkPassFileUrls: AppleWalletPkpassFilesType = {
      "logo.png": input.fields.frontSide.pngLogoUrl["660x660"],
      "strip.png": input.fields.frontSide.pngImageUrl["375x144"],
      "icon.png": input.fields.frontSide.pngLogoUrl["660x660"],
      // "logo@2x.png": "string",
      // "logo@3x.png": "string",
      "strip@2x.png": input.fields.frontSide.pngImageUrl["375x144@2x"],
      "strip@3x.png": input.fields.frontSide.pngImageUrl["375x144@3x"],
      // "icon@2x.png": "string",
      // "icon@3x.png": "string"
    };
    return pkPassFileUrls;
  }
  mapCreateOrUpdateCardInputToPkPassFields(input: CreateOrUpdateCardInput) {
    return {
      backgroundColor: "#000000", // These colors and other similar fields should be taken from input or set statically
      foregroundColor: "#ffffff",
      labelColor: "#ffffff",
      authenticationToken: "geepighooHeit9ku",
      webServiceURL: `${path.join(
        this.config.serviceRootUrl,
        "apple-webhook"
      )}`,
      description: "Карточка участника",
      // organizationName: "Your Organization Name",
      // teamIdentifier: "yourTeamId",
      // passTypeIdentifier: "",
      formatVersion: 1,
      eventTicket: {
        headerFields: [
          input.fields.frontSide.eventName && {
            key: "eventName",
            label: "Событие",
            value: input.fields.frontSide.eventName,
          },
          input.fields.frontSide.eventDate && {
            key: "eventDate",
            label: "Дата",
            value: input.fields.frontSide.eventDate,
          },
          input.fields.frontSide.eventTime && {
            key: "eventTime",
            label: "Время",
            value: input.fields.frontSide.eventTime,
          },
        ].filter(Boolean),
        primaryFields: [
          {
            key: "personName",
            label: "ФИО",
            value: input.fields.frontSide.personName,
          },
          input.fields.frontSide.personPosition && {
            key: "personPosition",
            label: "Должность",
            value: input.fields.frontSide.personPosition,
          },
        ].filter(Boolean),
        secondaryFields: [
          input.fields.frontSide.personStatus && {
            key: "personStatus",
            label: "Статус",
            value: input.fields.frontSide.personStatus,
          },
        ].filter(Boolean),
        auxiliaryFields: [
          input.fields.frontSide.logoText && {
            key: "logoText",
            label: "",
            value: input.fields.frontSide.logoText,
          },
        ].filter(Boolean),
        backFields: [
          input.fields.backSide?.eventDesciption && {
            key: "eventDesciption",
            label: "Описание события",
            value: input.fields.backSide?.eventDesciption,
          },
          input.fields.backSide?.supportPhone && {
            key: "supportPhone",
            label: "Телефон службы поддержки",
            value: input.fields.backSide?.supportPhone,
          },
          input.fields.backSide?.siteLink && {
            key: "siteLink",
            label: "Ссылка на сайт",
            value: input.fields.backSide?.siteLink,
          },
          ...(
            (input.fields.backSide ?? { socialLinks: [] })?.socialLinks ?? []
          ).map((link, i) => ({
            key: `socialLink${i + 1}`,
            label: link.label,
            value: link.value,
          })),
        ].filter(Boolean),
      },
    };
  }
}
export const walletPassPdermApp = new WalletPassPdermApp(
  config_mg_pderm_walletPass_$basic
);
