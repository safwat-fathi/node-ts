import { model } from "mongoose";
import { Shop, ShopDoc, TSortBy, StoreDB } from "types/db";
import { ShopsSchema } from "./shops.schema";

export const ShopsModel = model<ShopDoc>("Shop", ShopsSchema);

export class ShopsStore implements Partial<StoreDB<Shop>> {
  async index(
    skip?: number,
    pageSize?: number,
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
          .skip(skip || 0)
          .limit(pageSize || 10),
        ShopsModel.estimatedDocumentCount(),
      ]);

      return [shops, count];
    } catch (err) {
      throw new Error(`ShopsStore::index::${err}`);
    }
  }

  async filter(
    filters: TFindBy<T> | TFindBy<T>[]
  ): Promise<Shop | Shop[] | null> {
    try {
      const shops: Shop | Shop[] = await ShopsModel.find({
        [String(filters.by)]: filters.value,
      });

      if (!shops) {
        return null;
      }

      return shops;
    } catch (err) {
      throw new Error(`ShopsStore::find::${err}`);
    }
  }
}
