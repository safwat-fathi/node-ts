import { CategoryStore } from "models/categories/categories.model";
import { Document, HydratedDocument, model } from "mongoose";
import {
  Product,
  ProductDoc,
  StoreDB,
  TFindBy,
  TQuery,
  TSortBy,
} from "types/db";
import { ProductsSchema } from "./products.schema";

export const ProductsModel = model<Product>("Product", ProductsSchema);

export const withFilters = async (filters?: TFindBy<Product>) => {
  const query = ProductsModel.find({
    name: ["Long Sleeve White Shirt", "Grey Sweatshirt"],
  });

  query.getFilter();

  const res = await query.exec();
  console.log("🚀 ~ withFilters ~ res", res);
};

export class ProductsStore implements Partial<StoreDB<Product>> {
  async index(
    skip: number = 0,
    pageSize: number,
    sort?: TSortBy | null,
    filters?: TQuery<Product>
  ): Promise<[ProductDoc[], number]> {
    try {
      const [products, count] = await Promise.all([
        ProductsModel.find(
          // filters by model props (name, price, etc...)
          {},
          null,
          // options (sort, pagination, etc...)
          {
            ...(sort && {
              sort: { [sort.by]: sort.type },
            }),
          }
        )
          .skip(skip)
          .limit(pageSize),
        ProductsModel.estimatedDocumentCount(),
      ]);

      return [products, count];
    } catch (err) {
      throw new Error(`ProductStore::index::${err}`);
    }
  }

  async find(
    find: TFindBy<Product> | TFindBy<Product>[]
  ): Promise<ProductDoc | ProductDoc[] | null> {
    try {
      let products: ProductDoc | ProductDoc[] | null = [];

      if (Array.isArray(find)) {
        let query: any = [];

        for (let i in find) {
          query = [...query, { [String(find[i].by)]: find[i].value }];
        }

        products = await ProductsModel.find({
          $or: query,
        });
      } else {
        products = await ProductsModel.findOne({
          [String(find.by)]: find.value,
        });
      }

      if (!products) {
        return null;
      }

      return products;
    } catch (err) {
      throw new Error(`ProductStore::find::${err}`);
    }
  }

  async create(newProduct: Product): Promise<ProductDoc> {
    try {
      const product = await ProductsModel.create(newProduct);

      await product.save();

      return product;
    } catch (err) {
      throw new Error(`ProductStore::find::${err}`);
    }
  }
}
