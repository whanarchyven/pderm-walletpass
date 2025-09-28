import { PKPass } from "passkit-generator";
import { PreConfiguredService } from "@/src/service/precon/Pre";
import { NextResponse } from "next/server";
import { AppleWalletPkpassFilesType } from "@/src/service/precon/ext/wallet-pass/apple/types/pkpass-files.type";
import {
  EntityDbPreConfiguredService,
  EntityDbPreConfiguredServiceOptions,
} from "@/src/service/precon/db/entity/entity.service";
import axios from "axios";

async function getImageBuffer(url) {
  // const root="http://localhost:3000" //
  const root = "https://pediatric-dermatology.vercel.app"
  const response = await axios.get(
       root + url,
      {
        responseType: "arraybuffer",
      }
  );
  return Buffer.from(response.data, "binary");
}

export interface AppleWalletPassPreConfiguredServiceOptions {
  wwdr: string;
  signerCert: string;
  signerKey: string;
  signerKeyPassphrase: string;
  type: "event";
  passFileUrl: string;
  organizationName: string;
  teamIdentifier: string;
  passTypeIdentifier: string;
  peer: {
    registeredDeviceModel: EntityDbPreConfiguredServiceOptions;
  };
}
export class AppleWalletPassPreConfiguredService extends PreConfiguredService<AppleWalletPassPreConfiguredServiceOptions> {
  registeredDeviceModel = new EntityDbPreConfiguredService(
    this.config.peer.registeredDeviceModel
  ).asMongoCollection();
  getPkPassIdentifiers() {
    const { organizationName, teamIdentifier, passTypeIdentifier } =
      this.config;
    return { organizationName, teamIdentifier, passTypeIdentifier };
  }
  async generatePass(props: {
    // pkPassJson: AppleWalletPkpassJsonType;
    pkPassFilesUrls: AppleWalletPkpassFilesType;
    overrides: any;
  }) {
    /** Each, but last, can be either a string or a Buffer. See API Documentation for more */
    const { wwdr, signerCert, signerKey, signerKeyPassphrase } = this.config;

    const pass = await new PKPass(
        {
          "icon.png": await getImageBuffer("/pkpass/icon.png"),
          "logo.png": await getImageBuffer("/pkpass/logo.png"),
          "strip.png": await getImageBuffer("/pkpass/pderm_cover_2025_oct_min.png"),
          "pass.json": await getImageBuffer("/pkpass/pass.json"),
        },

        {
          wwdr,
          signerCert,
          signerKey,
          signerKeyPassphrase,
        },
        {
          // keys to be added or overridden
          serialNumber: props.overrides.userUid,
        }
    );
    pass.secondaryFields.push({
      key: "fio",
      label: "ФИО",
      value: props.overrides.fields.frontSide.personName,
      // textAlignment: "PKTextAlignmentCenter",
    });
    pass.headerFields.push({
      key: "status",
      label: "Статус",
      value: props.overrides.fields.frontSide.personStatus,
    });
    pass.backFields.push({
      key: "message",
      label: "Сообщение",
      value:
        props.overrides.fields?.frontSide?.message ??
        props.overrides.fields?.backSide?.message ??
        "",
      changeMessage: "%@",
    });
    // console.log("props.pkPassJson", props.pkPassJson);
    // const pass = await new PKPass(
    //   {
    //     "pass.json": Buffer.from(JSON.stringify(props.pkPassJson)),
    //     "logo.png": await axios
    //       .get(props.pkPassFilesUrls["logo.png"], {
    //         responseType: "arraybuffer",
    //       })
    //       .then((d) => d.data),
    //     "strip.png": await axios
    //       .get(props.pkPassFilesUrls["strip.png"], {
    //         responseType: "arraybuffer",
    //       })
    //       .then((d) => d.data),
    //     "icon.png": await axios
    //       .get(props.pkPassFilesUrls["icon.png"], {
    //         responseType: "arraybuffer",
    //       })
    //       .then((d) => d.data),
    //   },
    //   {
    //     wwdr,
    //     signerCert,
    //     signerKey,
    //     signerKeyPassphrase,
    //   }
    // );

    // Adding some settings to be written inside pass.json

    // // Generate the stream .pkpass file stream
    // const stream = pass.getAsStream();
    // doSomethingWithTheStream(stream);

    // or
    pass.setBarcodes(props.overrides.fields.frontSide.qrCodeData);

    const buffer = pass.getAsBuffer();
    return buffer;
  }
  async asNextResponseForProcessAppleWebhookOnPassInstall(
    appleParams: string[],
    pushToken: any
  ) {
    const [
      v1,
      devices,
      deviceLibraryIdentifier,
      registrations,
      passTypeIdentifier,
      serialNumber,
    ] = appleParams;
    if (!serialNumber) return new NextResponse("no-serial", { status: 400 });
    const res = await this.registeredDeviceModel.findOneAndUpdate(
      {
        devices,
        deviceLibraryIdentifier,
        registrations,
        passTypeIdentifier,
        serialNumber,
      },
      {
        $set: {
          v1,
          devices,
          deviceLibraryIdentifier,
          registrations,
          passTypeIdentifier,
          serialNumber,
          pushToken,
        },
      },
      { upsert: true }
    );
    return new NextResponse("ok", { status: 201 });
  }

  getHeaders() {
    return {
      "Content-Disposition": "attachment; filename=pass.pkpass",
      "Content-Type":"application/vnd.apple.pkpass"
    };
  }
}
