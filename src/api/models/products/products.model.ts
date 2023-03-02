// import { CategoryStore } from "api/models/categories/categories.model";
import { model, Query } from "mongoose";
import { Product, ProductDoc, StoreDB, TSortBy } from "types/db";
import { ProductsSchema } from "./products.schema";

export const ProductsModel = model<Product>("Product", ProductsSchema);

export class ProductsStore implements Partial<StoreDB<Product>> {
  async index(
    skip?: number,
    pageSize?: number,
    sort?: TSortBy | null,
    filter?: any | null
  ): Promise<[Product[], number]> {
    try {
      const query = ProductsModel.find(
        // filter by model fields (name, price, stock, etc...)
        filter || {},
        // select model fields to return
        null,
        // options (sort, pagination, etc...)
        {
          ...(sort && {
            sort,
          }),
        }
      )
        .skip(skip || 0)
        .limit(pageSize || 10);

      const [products, count] = await Promise.all([
        query.exec(),
        ProductsModel.estimatedDocumentCount(),
      ]);

      return [products, count];
    } catch (err) {
      throw new Error(`ProductStore::index::${err}`);
    }
  }

  async create(newProduct: Product): Promise<ProductDoc> {
    try {
      const product = await ProductsModel.create(newProduct);

      await product.save();

      return product;
    } catch (err) {
      throw new Error(`ProductStore::create::${err}`);
    }
  }
}
