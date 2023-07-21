import { Types } from "mongoose";
import { ProductModel } from "@/models/products/products.model";
import { Product, ProductDoc, Service, TSortBy } from "@/types/db";

export class ProductService implements Partial<Service<Product>> {
  async index(
    skip?: number,
    pageSize?: number,
    sort?: TSortBy | null,
    filter?: any | null
  ): Promise<[Product[], number]> {
    console.log("🚀 ~ filter:", filter);
    const aa = await ProductModel.find({
      // categories: "64baa25b328ab1c619fb1aa1",
      categories: {
        $in: ["64baa25b328ab1c619fb1aa0", "64baa25b328ab1c619fb1aa1"],
      },
    });
    // console.log("🚀 ~ aa:", aa);
    try {
      let query = null;

      // if not pagination its find query
      if (!skip && !pageSize && !sort) {
        query = ProductModel.find(filter);
      } else {
        query = ProductModel.find(
          // filter by model fields
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
          .limit(pageSize || 10)
          .populate({ path: "categories", select: "name" });
      }

      const [products, count] = await Promise.all([
        query.exec(),
        ProductModel.estimatedDocumentCount(),
      ]);

      return [products, count];
    } catch (err) {
      throw new Error(`ProductService::index::${err}`);
    }
  }

  async find(p: Partial<ProductDoc>): Promise<ProductDoc | null> {
    try {
      const product = await ProductModel.findOne({ _id: p.id });

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
