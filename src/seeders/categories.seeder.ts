import { CategoryModel } from "models/categories/categories.model";
import dotenv from "dotenv";

dotenv.config();

export const seedCategories = () => {
  CategoryModel.estimatedDocumentCount({}, async (err, count) => {
    // drop all stored docs
    // CategoryModel.collection.drop();

    if (err) throw new Error(`${err}`);

    if (count === 0) {
      CategoryModel.collection
        .insertMany([
          { name: "Shirts", description: "All Shirts", parent: null },
          { name: "Foods", description: "All food", parent: null },
        ])
        .then(users => console.log(`${users.insertedCount} users created`))
        .catch(err => new Error(`Categories::seeder::${err}`));
    }
  });
};
