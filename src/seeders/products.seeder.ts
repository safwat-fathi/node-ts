import { ProductsModel } from "models/products/products.model";
import dotenv from "dotenv";

dotenv.config();

export const seedProducts = async () => {
  ProductsModel.estimatedDocumentCount({}, (err, count) => {
    // drop all stored docs
    // ProductModel.collection.drop();

    if (err) throw new Error(`${err}`);

    if (count === 0) {
      ProductsModel.insertMany([
        {
          name: "Long Sleeve White Shirt",
          description: "Long sleeve white shirt - spring collection",
          images: [{ url: "http://test.images.white-shirt" }],
          price: {
            egp: 240,
            usd: 9,
          },
          stock: 120,
          categories: [],
        },
        {
          name: "Grey Sweatshirt",
          description: "Grey sweatshirt with hoodie - winter collection",
          images: [{ url: "http://test.images.grey-sweatshirt" }],
          price: {
            egp: 600,
            usd: 20,
          },
          stock: 90,
          categories: [],
        },
      ])
        .then(products => console.log(`${products.length} products created`))
        .catch(err => new Error(`Products::seeder::${err}`));
    }
  });
};
