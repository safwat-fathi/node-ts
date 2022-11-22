import { model } from "mongoose";
import { Product } from "types/db";
import { productSchema } from "./products.schema";

export const ProductModel = model<Product>("Product", productSchema);

export class ProductStore {
  async index(
    skip: number | null = 0,
    limit: number | null = 10,
    page: number | null = 1
  ): Promise<Product[]> {
    try {
      // * dynamic page size
      // const products = ProductModel.find({}).skip(skip).limit(limit);
      // * fixed page size
      const PAGE_SIZE = 10;
      const SKIP = ((page as number) - 1) * PAGE_SIZE;
      const products = ProductModel.find({}).skip(SKIP).limit(PAGE_SIZE);

      return products;
    } catch (err) {
      throw new Error(`error indexing products: ${err}`);
    }
  }
}
