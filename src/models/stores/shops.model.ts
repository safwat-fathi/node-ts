import { model } from "mongoose";
import { Shop, ShopDoc, StoreDB } from "types/db";
import { ShopsSchema } from "./shops.schema";
import { createHash } from "crypto";

export const ShopsModel = model<ShopDoc>("Shop", ShopsSchema);

export class ShopsStore implements Partial<StoreDB<Shop>> {
  async index(
    skip: number | null = 0,
    limit: number | null = 10,
    page = 1,
    // geolocation?: [string, string],
    // distance?: number
    sort?: { by: string; type: "ascend" | "descend" }
  ): Promise<{
    data: Shop[];
    meta: { current_page: number; total_pages: number; hash: string };
  }> {
    try {
      // * dynamic page size
      // const shops = ShopsModel.find({}).skip(skip).limit(limit);

      // const lng = geolocation[0];
      // const lat = geolocation[1];
      // earth radius is 6378 km
      // const radius = distance / 6378;

      // * fixed page size
      const PAGE_SIZE = limit || 10;
      const SKIP = skip || ((page as number) - 1) * PAGE_SIZE;

      const [shops, count] = await Promise.all([
        ShopsModel.find(
          {
            // location: {
            //   $geoWithin: {
            //     $centerSphere: [[lng, lat], radius],
            //   },
            // },
          },
          null,
          {
            ...(sort && {
              sort: { [sort.by]: sort.type === "ascend" ? 1 : -1 },
            }),
          }
        )
          .skip(SKIP)
          .limit(PAGE_SIZE),
        ShopsModel.estimatedDocumentCount(),
      ]);

      // hashing data to help client identify data has changed
      const data_stringified = JSON.stringify(shops);
      const data_hash = createHash("md5")
        .update(data_stringified)
        .copy()
        .digest("hex");

      return {
        data: shops,
        meta: {
          current_page: page,
          total_pages: Math.ceil(count / PAGE_SIZE),
          hash: data_hash,
        },
      };
    } catch (err) {
      throw new Error(`error indexing shops: ${err}`);
    }
  }

  async find(find: {
    by: { [key in keyof Shop]: string };
    value: any;
  }): Promise<{ data: Shop | Shop[] } | null> {
    try {
      const shop: Shop | Shop[] = await ShopsModel.find({
        [String(find.by)]: find.value,
      });

      if (!shop) {
        return null;
      }

      return { data: shop };
    } catch (err) {
      throw new Error(`error finding shops ${err}`);
    }
  }
}
