import { CategoryModel } from "@models/categories/categories.model";
import { ProductModel } from "@models/products/products.model";
import dotenv from "dotenv";
import { slugify } from "@lib/utils/string";

dotenv.config();

export const seedProducts = () => {
  try {
    ProductModel.estimatedDocumentCount({}, async (err, count) => {
      const categoryCloths = await CategoryModel.findOne({ name: "Cloths" });

      // drop all stored docs
      // await ProductModel.collection.drop();

      // Rebuild all indexes
      await ProductModel.syncIndexes();

      if (err) throw new Error(`${err}`);

      if (count === 0) {
        const products = await ProductModel.insertMany([
          {
            name: "Long Sleeve White Shirt",
            // slug: slugify("Long Sleeve White Shirt"),
            description: "Long sleeve white shirt - spring collection",
            images: [{ url: "http://test.images.white-shirt" }],
            price: 240,
            stock: 120,
            categories: [categoryCloths?.id],
          },
          {
            name: "Grey shirt",
            // slug: slugify("Grey shirt"),
            description: "Grey shirt with hoodie - winter collection",
            images: [{ url: "http://test.images.grey-shirt" }],
            price: 600,
            stock: 90,
            categories: [categoryCloths?.id],
          },
        ]);

        if (products.length) {
          console.log(`${products.length} products created`);
        }
      }
    });
  } catch (err) {
    new Error(`Products::seeder::${err}`);
  }
};
