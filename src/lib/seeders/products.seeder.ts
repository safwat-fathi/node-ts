import { CategoryModel } from "@/models/categories/categories.model";
import { ProductModel } from "@/models/products/products.model";
import dotenv from "dotenv";

dotenv.config();

export const seedProducts = () => {
  try {
    ProductModel.estimatedDocumentCount({}, async (err, count) => {
      const categoryCloths = await CategoryModel.findOne({ name: "Cloths" });
      const categoryFood = await CategoryModel.findOne({ name: "Food" });
      const categoryShoes = await CategoryModel.findOne({ name: "Shoes" });

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
            images: ["http://test.images.white-shirt"],
            // images: [{ url: "http://test.images.white-shirt" }],
            price: 240,
            stock: 120,
            // categories: [categoryCloths?.id],
          },
          {
            name: "Grey shirt",
            // slug: slugify("Grey shirt"),
            description: "Grey shirt with hoodie - winter collection",
            images: ["http://test.images.grey-shirt"],
            // images: [{ url: "http://test.images.grey-shirt" }],
            price: 600,
            stock: 90,
            // categories: [categoryCloths?.id],
          },
          {
            name: "Skimmed Milk",
            description: "Juhanya skimmed milk - 1 liter",
            images: ["http://test.images.grey-shirt"],
            // images: [{ url: "http://test.images.grey-shirt" }],
            price: 6,
            stock: 20,
            // categories: [categoryFood?.id],
          },
          {
            name: "Nike Air",
            description: "Nike Air - Black",
            images: ["http://test.images.grey-shirt"],
            // images: [{ url: "http://test.images.grey-shirt" }],
            price: 6,
            stock: 20,
            // categories: [categoryShoes?.id],
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
