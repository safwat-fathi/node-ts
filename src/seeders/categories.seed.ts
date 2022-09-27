import { CategoryModel } from "models/categories/categories.model";
import dotenv from "dotenv";

dotenv.config();

export const seedCategories = () => {
  CategoryModel.estimatedDocumentCount({}, async (err, count) => {
    if (!err && count === 0) {
      const foodParent = await CategoryModel.create({
        name: "Foods",
        description: "All food",
        parent: null,
      });

      await CategoryModel.create({
        name: "Cereal, dry Instant",
        description:
          "All dry Instant cereal, regular and high protein, with or without fruit. which have been specially formulated or processed for use by infants up to 12 months of age",
        parent: foodParent.id,
        sub: null,
      });
    }
  });
};
