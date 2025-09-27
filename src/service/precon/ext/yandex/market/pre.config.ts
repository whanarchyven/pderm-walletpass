import { YandexMarketPreConfiguredServiceOptions } from "@/src/service/precon/ext/yandex/market/yandex-market.service";

export const pre_ext_yandex_market_$test: YandexMarketPreConfiguredServiceOptions =
  {
    businessId: "",
    campaignId: "58981379",
    oauthToken: process.env.YANDEX_OAUTH_TOKEN || "",
  };
