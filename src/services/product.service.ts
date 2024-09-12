import { AppDataSource } from "@/config/db.config";
import { Product } from "@/entities/product.entity";

import { CrudService } from "@/lib/controllers/crud.controller";
import { Repository } from "typeorm";

export class ProductService implements CrudService<Product> {
  private _productRepository: Repository<Product>;

  constructor() {
    this._productRepository = AppDataSource.getRepository(Product);
  }

  async create(product: Partial<Product>): Promise<Product> {
    const existingProduct = await this._productRepository.findOneBy({
      name: product.name,
    });

    if (existingProduct) {
      throw new Error("Product already exist");
    }

    const newProduct = this._productRepository.create(product);
    return this._productRepository.save(newProduct);
  }

  async read(id: string): Promise<Product | null> {
    return this._productRepository.findOneBy({ id });
  }

  async update(id: string, item: Partial<Product>): Promise<Product | null> {
    const product = await this.read(id);

    if (!product) {
      return null;
    }

    await this._productRepository.update(id, item);
    return this.read(id);
  }

  async delete(id: string): Promise<Product | null> {
    const product = await this.read(id);

    if (product) {
      await this._productRepository.remove(product);
    }

    return product;
  }

  async list(): Promise<Product[]> {
    return this._productRepository.find();
  }

  async search(searchTerm: string, field: string): Promise<Product[]> {
    return this._productRepository.find({
      where: {
        [field]: searchTerm,
      },
    });
  }

  async count(): Promise<number> {
    return this._productRepository.count();
  }

  async listByCategory(categoryId: string): Promise<Product[]> {
    return this._productRepository.find({
      where: {
        categories: { id: categoryId },
      },
    });
  }
}
