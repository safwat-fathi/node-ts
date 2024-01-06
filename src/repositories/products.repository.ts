import { Product, TDoc } from "@/types/db";
import { BaseRepository, IRead, IWrite } from "./base.repository";
import { FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import { ProductsSchema } from "@/models/products/products.schema";

export class ProductRepository
  extends BaseRepository<Product>
  implements IRead<Product>, IWrite<Product>
{
  constructor() {
    super("Product", ProductsSchema);
  }

  public async find(
    query: FilterQuery<TDoc<Product>>,
    projection?: ProjectionType<Product> | null,
    options?: QueryOptions<TDoc<Product>>
  ): Promise<TDoc<Product>[]> {
    const products = await this._model.find(query, projection, options);

    return products;
  }
}
