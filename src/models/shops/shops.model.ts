import { model } from "mongoose";
import { ShopDoc } from "@/types/db";
import { ShopsSchema } from "./shops.schema";

export const ShopModel = model<ShopDoc>("Shop", ShopsSchema);

// export class ShopService {
//   async index(
//     skip?: number,
//     pageSize?: number,
//     // geolocation?: [string, string],
//     // distance?: number
//     sort?: TSortBy | null
//   ): Promise<[Shop[], number]> {
//     try {
//       // const lng = geolocation[0];
//       // const lat = geolocation[1];
//       // earth radius is 6378 km
//       // const radius = distance / 6378;

//       const [shops, count] = await Promise.all([
//         ShopModel.find({}, null, {
//           ...(sort && {
//             sort: { [sort.by]: sort.type },
//           }),
//         })
//           .skip(skip || 0)
//           .limit(pageSize || 10),
//         ShopModel.estimatedDocumentCount(),
//       ]);

//       return [shops, count];
//     } catch (err) {
//       throw new Error(`ShopsStore::index::${err}`);
//     }
//   }

//   async filter(
//     filters: TFindBy<T> | TFindBy<T>[]
//   ): Promise<Shop | Shop[] | null> {
//     try {
//       const shops: Shop | Shop[] = await ShopModel.find({
//         [String(filters.by)]: filters.value,
//       });

//       if (!shops) {
//         return null;
//       }

//       return shops;
//     } catch (err) {
//       throw new Error(`ShopsStore::find::${err}`);
//     }
//   }
// }
