// import { CategoryStore } from "api/models/categories/categories.model";
import { isSafeToParse } from "lib/utils/string";
import { model, Query } from "mongoose";
import {
  Product,
  ProductDoc,
  StoreDB,
  // TFindBy,
  TQuery,
  TSortBy,
} from "types/db";
import { ProductsSchema } from "./products.schema";

export const ProductsModel = model<Product>("Product", ProductsSchema);

// export const withFilters: <T>(f: TQuery) => void = async (filters: TQuery) => {
//   const query: Query<Product[], Product> =
//     ProductsModel.find(filters).where("rating");

//   query.getFilter();

//   const res = await query.exec();
//   console.log("🚀 ~ withFilters ~ res", res);
// };

export class ProductsStore implements Partial<StoreDB<Product>> {
  async index(
    skip?: number,
    pageSize?: number,
    sort?: TSortBy | null,
    filters?: TQuery<Product>
  ): Promise<[Product[], number]> {
    // console.log("🚀 ~ filters:", filters);

    // parse params
    if (filters) {
      let key: keyof Product;

      for (key in filters) {
        if (isSafeToParse(filters[key])) {
          switch (key) {
            case "price":
              filters[key] = JSON.parse(filters[key]);
              break;
            case "stock":
              filters[key] = JSON.parse(filters[key]) ? 1 : 0;
              break;
            default:
              break;
          }

          // if array
          // if (Array.isArray(JSON.parse(filters[key]))) {
          //   console.log("🚀 ~ is array:", JSON.parse(filters[key]));
          // }

          // // if boolean
          // if (typeof JSON.parse(filters[key]) === "boolean") {
          //   console.log("🚀 ~ is boolean:", JSON.parse(filters[key]));
          // }

          // // if null or undefined
          // if (!JSON.parse(filters[key])) {
          //   console.log("🚀 ~ is null or undefined:", JSON.parse(filters[key]));
          // }
        } else {
          console.log("🚀 ~ filters[key] not parsed:", filters[key]);
        }
        console.log("🚀 ~ filters[key] parsed:", filters[key]);
      }
    }

    // const query: Query<Product[], Product> = ProductsModel.find({}).where("name").in(['']);

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

  async filter(filters: TQuery<Product>): Promise<Product | Product[] | null> {
    try {
      // if (!Array.isArray(filters)) {
      const query: Query<Product[], Product> = ProductsModel.find(filters);
      // query = ProductsModel.find({
      //   [filters.by]: filters.value,
      // });
      query.getFilter();

      const data = await query.exec();
      // console.log("🚀 ~ product store - filter data:", data);
      // }

      if (!data) return null;

      return data;
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
      throw new Error(`ProductStore::filter::${err}`);
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
