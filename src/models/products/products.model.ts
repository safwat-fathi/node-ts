import { CategoryStore } from "models/categories/categories.model";
import { model, Query } from "mongoose";
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

export const withFilters = async (
  filters: TFindBy<Product> | TFindBy<Product>[]
) => {
  let query: Query<Product[], Product>;

  if (!Array.isArray(filters)) {
    query = ProductsModel.find({
      [filters.by]: filters.value,
    });
    query.getFilter();

    const res = await query.exec();
    console.log("🚀 ~ withFilters ~ res", res);
  }
};

export class ProductsStore implements Partial<StoreDB<Product>> {
  async index(
    skip?: number,
    pageSize?: number,
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
          .skip(skip || 0)
          .limit(pageSize || 10),
        ProductsModel.estimatedDocumentCount(),
      ]);

      return [products, count];
    } catch (err) {
      throw new Error(`ProductStore::index::${err}`);
    }
  }

  async filter(
    filters: TFindBy<Product> | TFindBy<Product>[]
  ): Promise<ProductDoc | ProductDoc[] | null> {
    try {
      let query: Query<Product[], Product>;

      if (!Array.isArray(filters)) {
        query = ProductsModel.find({
          [filters.by]: filters.value,
        });
        query.getFilter();

        const res = await query.exec();
        console.log("🚀 ~ withFilters ~ res", res);
      }

      return [];
      // let products: ProductDoc | ProductDoc[] | null = [];

      // if (Array.isArray(filters)) {
      //   let query: any = [];

      //   for (let i in filters) {
      //     query = [...query, { [String(filters[i].by)]: filters[i].value }];
      //   }

      //   products = await ProductsModel.find({
      //     $or: query,
      //   });
      // } else {
      //   products = await ProductsModel.findOne({
      //     [String(filters.by)]: filters.value,
      //   });
      // }

      // if (!products) {
      //   return null;
      // }

      // return products;
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
