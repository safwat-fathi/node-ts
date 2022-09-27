import { ProductModel } from "models/products/products.model";
import dotenv from "dotenv";

dotenv.config();

export const seedProducts = () => {
  ProductModel.estimatedDocumentCount({}, (err, count) => {
    // ProductModel.collection.drop();
    if (!err && count === 0) {
      ProductModel.insertMany([
        {
          name: "Corn Flakes",
          description: "For breakfast",
          images: [{ url: "http://test.images.cornFlakes" }],
          price: 24,
          stock: 120,
          categories: ["632ef4de7683d5e43f3360b1", "632ef18512f70440d2b9e68c"],
        },
        {
          name: "Oats",
          description: "For any time at day meal",
          images: [{ url: "http://test.images.oats" }],
          price: 29,
          stock: 20,
          categories: ["632ef4de7683d5e43f3360b1", "632ef18512f70440d2b9e68d"],
        },
      ])
        .then((products) => console.log(`${products.length} products created`))
        .catch((err) => console.log("Products seeder error:", err));
    }
  });
};
