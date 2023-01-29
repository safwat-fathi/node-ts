import { model } from "mongoose";
import { Product } from "types/db";
import { ProductsSchema } from "./products.schema";
import { createHash } from "crypto";

export const ProductsModel = model<Product>("Product", ProductsSchema);

export class ProductsStore {
  async index(
    skip: number | null = 0,
    limit: number | null = 10,
    page: number = 1,
    sort?: { by: string; type: "ascend" | "descend" }
    // filter: "price" | "review" | null = null
  ): Promise<{
    data: Product[];
    meta: { current_page: number; total_pages: number; hash: string };
  }> {
    try {
      // * dynamic page size
      // const products = ProductsModel.find({}).skip(skip).limit(limit);
      // * fixed page size
      const PAGE_SIZE = limit || 10;
      const SKIP = skip || ((page as number) - 1) * PAGE_SIZE;

      const [products, count] = await Promise.all([
        ProductsModel.find(
          // filters by model props (name, price, etc...)
          {},
          null,
          // options (sort, pagination, etc...)
          {
            ...(sort && {
              sort: { [sort.by]: sort.type === "ascend" ? 1 : -1 },
            }),
          }
        )
          .skip(SKIP)
          .limit(PAGE_SIZE),
        ProductsModel.estimatedDocumentCount(),
      ]);

      // hashing data to help client identify data has changed
      const data_stringified = JSON.stringify(products);
      const data_hash = createHash("md5")
        .update(data_stringified)
        .copy()
        .digest("hex");

      return {
        data: products,
        meta: {
          current_page: page,
          total_pages: Math.ceil(count / PAGE_SIZE),
          hash: data_hash,
        },
      };
    } catch (err) {
      throw new Error(`error indexing products: ${err}`);
    }
  }
}
