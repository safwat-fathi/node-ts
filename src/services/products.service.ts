import { ProductModel } from "@/models/products/products.model";
import { Product, ProductDoc, Service, TSortBy } from "@/types/db";
import { FilterQuery, ObjectId } from "mongoose";

export class ProductService implements Partial<Service<Product>> {
  async index(
    sort?: TSortBy | null | undefined,
    filter?: FilterQuery<Product>
  ): Promise<Product[]> {
    try {
      let query = null;

      if (!sort) {
        query = ProductModel.find(filter || {});
      } else {
        query = ProductModel.find(
          // filter by model fields
          filter || {},
          // select model fields to return
          null,
          // options (sort, pagination, etc...)
          { sort }
        );
      }

      const products = await query.exec();

      return products;
    } catch (err) {
      throw new Error(`ProductService::index::${err}`);
    }
  }

  async indexPaginated(
    skip?: number,
    pageSize?: number,
    sort?: TSortBy | null,
    filter?: FilterQuery<Product> | null
  ): Promise<[Product[], number]> {
    try {
      // convert price filter values to integers to be valid key in aggregate
      if (filter && filter.price) {
        const { price } = filter;

        Object.keys(price).forEach(
          key => (filter.price[key] = +filter.price[key])
        );
      }

      const pipeline: any[] = [
        { $match: filter || {} }, // Match the documents based on the provided filter
        ...(sort ? [{ $sort: sort }] : []), // Apply sorting if the `sort` variable is provided
        {
          $facet: {
            products: [{ $skip: skip || 0 }, { $limit: pageSize || 10 }],
            count: [{ $count: "total" }],
          },
        }, // Retrieve products and count
        {
          $project: {
            products: 1,
            count: { $arrayElemAt: ["$count.total", 0] },
          },
        }, // Restructure the results
      ];

      const [result] = await ProductModel.aggregate(pipeline);

      const { products, count } = result;

      return [products, count];
    } catch (err) {
      throw new Error(`ProductService::indexPaginated::${err}`);
    }
  }

  // async find(filter: any): Promise<ProductDoc | null> {
  async find(
    // filter: Partial<Record<keyof ProductDoc, any>>
    filter: FilterQuery<Product>
  ): Promise<ProductDoc | null> {
    // async find(slug: string): Promise<ProductDoc | null> {
    try {
      const product = await ProductModel.findOne(filter).select("+images");

      if (!product) {
        return null;
      }

      return product;
    } catch (err) {
      throw new Error(`ProductService::find::${err}`);
    }
  }

  async create(newProduct: Product): Promise<ProductDoc> {
    try {
      const product = await new ProductModel(newProduct);

      await product.save();

      return product;
    } catch (err) {
      throw new Error(`ProductService::create::${err}`);
    }
  }
}
