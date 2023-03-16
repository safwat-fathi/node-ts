import { CategoryModel } from "@models/categories/categories.model";
import { ProductModel } from "@models/products/products.model";
import dotenv from "dotenv";
import { slugify } from "@lib/utils/string";

dotenv.config();

export const seedProducts = () => {
  ProductModel.estimatedDocumentCount({}, async (err, count) => {
    const categoryCloths = await CategoryModel.findOne({ name: "Cloths" });

    // drop all stored docs
    ProductModel.collection.drop();

    // Rebuild all indexes
    await ProductModel.syncIndexes();

    if (err) throw new Error(`${err}`);

    if (count === 0) {
      ProductModel.collection
        .insertMany([
          {
            name: "Long Sleeve White Shirt",
            slug: slugify("Long Sleeve White Shirt"),
            description: "Long sleeve white shirt - spring collection",
            images: [{ url: "http://test.images.white-shirt" }],
            price: 240,
            stock: 120,
            category: [categoryCloths?._id],
          },
          {
            name: "Grey shirt",
            slug: slugify("Grey shirt"),
            description: "Grey shirt with hoodie - winter collection",
            images: [{ url: "http://test.images.grey-shirt" }],
            price: 600,
            stock: 90,
            category: [categoryCloths?._id],
          },
        ])
        .then(products =>
          console.log(`${products.insertedCount} products created`)
        )
        .catch(err => new Error(`Products::seeder::${err}`));
    }
  });
};
