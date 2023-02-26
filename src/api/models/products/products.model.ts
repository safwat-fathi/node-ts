// import { CategoryStore } from "api/models/categories/categories.model";
import { isSafeToParse } from "lib/utils/string";
import { model, Query } from "mongoose";
import { Product, ProductDoc, StoreDB, TSortBy } from "types/db";
import { ProductsSchema } from "./products.schema";

export const ProductsModel = model<Product>("Product", ProductsSchema);

const mapFilters = (filter: any) => {
  let filterCopy = { ...filter };

  try {
    for (let key in filterCopy) {
      if (isSafeToParse(filterCopy[key])) {
        if (typeof JSON.parse(filterCopy[key]) === "number") {
          filterCopy[key] = { $gte: +filterCopy[key] };
        }

        if (Array.isArray(JSON.parse(filterCopy[key]))) {
          const arr = JSON.parse(filterCopy[key]);

          filterCopy[key] = { $gte: arr[0], $lte: arr[1] };
        }
      }
    }

    return filterCopy;
  } catch (error) {
    throw new Error(`mapFilters::${error}`);
  }
};

export class ProductsStore implements Partial<StoreDB<Product>> {
  async index(
    skip?: number,
    pageSize?: number,
    sort?: TSortBy | null,
    filter?: any | null
  ): Promise<[Product[], number]> {
    try {
      const filtersMapped = mapFilters(filter);

      const [products, count] = await Promise.all([
        ProductsModel.find(
          // filter by model props (name, price, stock, etc...)
          filtersMapped || {},
          null,
          // options (sort, pagination, etc...)
          {
            ...(sort && {
              sort,
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
