import { PreConfiguredService } from "@/src/service/precon/Pre";
import axios from "axios";
import {
  yandexMarketOfferMappingEntriesExample,
  yandexMarketOrdersExample,
  yandexMarketStatsSkusExample,
} from "@/src/service/precon/ext/yandex/market/examples/example";

export interface YandexMarketPreConfiguredServiceOptions {
  oauthToken: string;
  campaignId: string;
  businessId: string;
}
export class YandexMarketPreConfiguredService extends PreConfiguredService<YandexMarketPreConfiguredServiceOptions> {
  async apiRequest(
    method: "POST" | "GET" | "PUT",
    path: string,
    params?: {
      queryParams?: any;
      body?: any;
    }
  ) {
    const url = path.match("https://")
      ? path
      : `https://api.partner.market.yandex.ru/campaigns/${this.config.campaignId}${path}`;

    const res = await axios({
      url,
      method,
      data: params?.body ?? {},
      params: params?.queryParams,
      headers: {
        Authorization: `Bearer ${this.config.oauthToken}`,
      },
    });
    return (res as any).data;
  }

  getCampaigns() {
    return this.apiRequest(
      "GET",
      "https://api.partner.market.yandex.ru/campaigns",
      {}
    );
  }
  getCampaignName() {
    return this.apiRequest(
      "GET",
      `https://api.partner.market.yandex.ru/campaigns/${this.config.campaignId}`,
      {}
    ) as Promise<{
      campaign: {
        domain: string;
        id: 58981379;
        clientId: 104032247;
      };
    }>;
  }
  async getOfferMappingEntries(page_token?: string) {
    return this.apiRequest("GET", "/offer-mapping-entries", {
      queryParams: {
        page_token,
      },
    });
  }
  getNextPageToken(entries: typeof yandexMarketOfferMappingEntriesExample) {
    return entries?.result?.paging?.nextPageToken;
  }
  mapOfferMappingEntries(
    entries: typeof yandexMarketOfferMappingEntriesExample
  ): {
    name: string;
    shopSku: string;
    marketSku: string;
    category: string;
    firstPictureUrl?: string;
    isActive: boolean;
  }[] {
    if (entries.status !== "OK") return [];
    return entries.result.offerMappingEntries.map((element) => {
      const { offer, mapping } = element;
      return {
        name: offer.name,
        shopSku: offer.shopSku,
        marketSku: mapping?.marketSku?.toString(),
        category: offer.category,
        firstPictureUrl: offer.pictures?.[0],
        isActive:
          offer.processingState.status === "READY" &&
          offer.availability === "ACTIVE",
      };
    });
  }

  getGoodsStats(shopSkus: string[]) {
    return this.apiRequest("POST", "/stats/skus", { body: { shopSkus } });
  }
  mapGoodsStats(statsSkusResult: typeof yandexMarketStatsSkusExample): {
    shopSku: string;
    price: number;
    stock: number;
  }[] {
    if (statsSkusResult.status !== "OK") return [];
    return statsSkusResult.result.shopSkus.map((product) => {
      return {
        shopSku: product.shopSku,
        price: product.price,
        stock:
          (product.warehouses ?? []).reduce(
            (p, c) => p + (c.stocks ?? []).reduce((p1, c1) => p1 + c1.count, 0),
            0
          ) ?? 0,
      };
    });
  }

  getOrdersStats(page_token?: string) {
    //limit 10k requests per hour
    return this.apiRequest("POST", "/stats/orders", {
      queryParams: {
        page_token,
        limit: 200,
      },
    });
  }
  mapOrdersStats(
    orders: typeof yandexMarketOrdersExample,
    products: Map<string, { cost: number }>
  ) {
    return orders.result.orders
      .map((order) => {
        if (order.fake) return;
        const unixTimestamp = new Date(order.statusUpdateDate).valueOf();
        return order.items
          .map((item) => {
            const bidFee = item.bidFee ?? 0;
            // const marketSku = item.marketSku;
            const shopSku = item.shopSku;
            const productUserInfo = products.get(shopSku);
            if (productUserInfo?.cost === undefined) return;
            const count = item.count;
            const total =
              item.prices.find((price) => price.type === "BUYER")?.total ?? 0;
            const profit =
              total - productUserInfo.cost * count - (bidFee / 10000) * total;
            return {
              unixTimestamp,
              shopSku,
              profit,
              bidFee,
              cost: productUserInfo.cost,
              count,
              total,
              // ToDo v2 category
            };
          })
          .filter(Boolean);
      })
      .filter(Boolean)
      .flat() as {
      unixTimestamp: number;
      shopSku: string;
      profit: number;
      bidFee: number;
    }[];
  }

  putBidsForBusiness(bids: { sku: string; bid: number }[]) {
    return this.apiRequest(
      "PUT",
      `https://api.partner.market.yandex.ru/businesses/${this.config.businessId}/bids`,
      { body: { bids } }
    );
  }
}
