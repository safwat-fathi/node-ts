import { ProductModel } from "@/models/products/products.model";
import { Product, ProductDoc, Service, TSortBy } from "@/types/db";

export class ProductService implements Partial<Service<Product>> {
  async index(
    skip?: number,
    pageSize?: number,
    sort?: TSortBy | null,
    // sort?: any,
    filter?: any | null
  ): Promise<[Product[], number]> {
    try {
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
      throw new Error(`ProductService::index::${err}`);
    }
  }

  async find(slug: string): Promise<ProductDoc | null> {
    try {
      const product = await ProductModel.findOne({ slug }).select("+images");

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
