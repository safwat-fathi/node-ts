import { CategoryModel } from "@models/categories/categories.model";
import dotenv from "dotenv";

dotenv.config();

export const seedCategories = () => {
  CategoryModel.estimatedDocumentCount({}, async (err, count) => {
    // drop all stored docs
    // CategoryModel.collection.drop();

    // Rebuild all indexes
    await CategoryModel.syncIndexes();

    if (err) throw new Error(`${err}`);

    if (count === 0) {
      const parentClothsCategory = await CategoryModel.collection.insertOne({
        name: "Cloths",
        description: "All Cloths",
        parent: null,
        sub: [],
      });

      CategoryModel.collection
        .insertMany([
          {
            name: "Shirts",
            description: "All Shirts",
            parent: parentClothsCategory.insertedId,
            sub: [],
          },
          { name: "Food", description: "All food", parent: null, sub: [] },
        ])
        .then(users => console.log(`${users.insertedCount} category created`))
        .catch(err => new Error(`Categories::seeder::${err}`));
    }
  });
};
