import { model } from "mongoose";
import { Shop, ShopDoc, TSortBy, StoreDB } from "types/db";
import { ShopsSchema } from "./shops.schema";

export const ShopsModel = model<ShopDoc>("Shop", ShopsSchema);

export class ShopsStore implements Partial<StoreDB<Shop>> {
  async index(
    skip: number = 0,
    pageSize: number,
    // geolocation?: [string, string],
    // distance?: number
    sort?: TSortBy | null
  ): Promise<[Shop[], number]> {
    try {
      // const lng = geolocation[0];
      // const lat = geolocation[1];
      // earth radius is 6378 km
      // const radius = distance / 6378;

      const [shops, count] = await Promise.all([
        ShopsModel.find({}, null, {
          ...(sort && {
            sort: { [sort.by]: sort.type },
          }),
        })
          .skip(skip)
          .limit(pageSize),
        ShopsModel.estimatedDocumentCount(),
      ]);

      return [shops, count];
    } catch (err) {
      throw new Error(`ShopsStore::index::${err}`);
    }
  }

  async find(find: {
    by: keyof Shop;
    value: any;
  }): Promise<Shop | Shop[] | null> {
    try {
      const shop: Shop | Shop[] = await ShopsModel.find({
        [String(find.by)]: find.value,
      });

      if (!shop) {
        return null;
      }

      return shop;
    } catch (err) {
      throw new Error(`ShopsStore::find::${err}`);
    }
  }
}
