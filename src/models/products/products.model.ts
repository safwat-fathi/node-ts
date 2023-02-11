import { model } from "mongoose";
import { Product, StoreDB } from "types/db";
import { ProductsSchema } from "./products.schema";
import { createHash } from "crypto";

export const ProductsModel = model<Product>("Product", ProductsSchema);

export class ProductsStore implements Partial<StoreDB<Product>> {
  async index(
    // skip: number | null = 0,
    // limit: number | null = 10,
    skip: number = 0,
    pageSize: number,
    // page: number = 1,
    sort?: { by: string; type: "ascend" | "descend" }
    // filter: "price" | "review" | null = null
  ): Promise<[Product[], number]> {
    try {
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
          .skip(skip)
          .limit(pageSize),
        ProductsModel.estimatedDocumentCount(),
      ]);

      return [products, count];
    } catch (err) {
      throw new Error(`error indexing products: ${err}`);
    }
  }

  async find(find: {
    by: keyof Product;
    value: any;
  }): Promise<Product | Product[] | null> {
    try {
      const product = await ProductsModel.find({
        [String(find.by)]: find.value,
      });

      if (!product) {
        return null;
      }

      return product;
    } catch (err) {
      throw new Error(`error finding products ${err}`);
    }
  }
}
