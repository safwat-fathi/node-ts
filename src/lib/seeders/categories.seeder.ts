import { CategoryModel } from "models/categories/categories.model";
import dotenv from "dotenv";

dotenv.config();

export const seedCategories = () => {
  CategoryModel.estimatedDocumentCount({}, async (err, count) => {
    // drop all stored docs
    CategoryModel.collection.drop();

    // Rebuild all indexes
    await CategoryModel.syncIndexes();

    if (err) throw new Error(`${err}`);

    if (count === 0) {
      const parentClothsCategory = await CategoryModel.collection.insertOne({
        name: "Cloths",
        description: "All Cloths",
        parent: null,
      });

      CategoryModel.collection
        .insertMany([
          {
            name: "Shirts",
            description: "All Shirts",
            parent: parentClothsCategory.insertedId,
          },
          { name: "Food", description: "All food", parent: null },
        ])
        .then(users => console.log(`${users.insertedCount} users created`))
        .catch(err => new Error(`Categories::seeder::${err}`));
    }
  });
};
