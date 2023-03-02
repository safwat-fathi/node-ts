import { ProductsModel } from "api/models/products/products.model";
import dotenv from "dotenv";
import { slugify } from "lib/utils/string";

dotenv.config();

export const seedProducts = () => {
  ProductsModel.estimatedDocumentCount({}, async (err, count) => {
    // drop all stored docs
    // ProductsModel.collection.drop();

    // Rebuild all indexes
    // await ProductsModel.syncIndexes();

    if (err) throw new Error(`${err}`);

    if (count === 0) {
      ProductsModel.collection
        .insertMany([
          {
            name: "Long Sleeve White Shirt",
            slug: slugify("Long Sleeve White Shirt"),
            description: "Long sleeve white shirt - spring collection",
            images: [{ url: "http://test.images.white-shirt" }],
            price: 240,
            stock: 120,
            categories: [],
          },
          {
            name: "Grey Sweatshirt",
            slug: slugify("Grey Sweatshirt"),
            description: "Grey sweatshirt with hoodie - winter collection",
            images: [{ url: "http://test.images.grey-sweatshirt" }],
            price: 600,
            stock: 90,
            categories: [],
          },
        ])
        .then(products =>
          console.log(`${products.insertedCount} products created`)
        )
        .catch(err => new Error(`Products::seeder::${err}`));
    }
  });
};
