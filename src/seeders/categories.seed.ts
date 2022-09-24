import { CategoryModel } from "models/categories/categories.model";
import dotenv from "dotenv";

dotenv.config();

export const seedCategories = async () => {
  const foodParent = await CategoryModel.create({
    name: "Foods",
    description: "All food",
    parent: null,
  });

  CategoryModel.estimatedDocumentCount({}, (err, count) => {
    // CategoryModel.collection.drop();
    if (!err && count === 0) {
      CategoryModel.insertMany([
        {
          name: "Cereal, dry Instant",
          description:
            "All dry Instant cereal, regular and high protein, with or without fruit. which have been specially formulated or processed for use by infants up to 12 months of age",
          parent: foodParent.id,
        },
        {
          name: "Dinners, desserts, fruits, vegetables or soups, dry mix",
          description:
            "Dry instant dinners, dessert., fruits. vegetables, and soups which have been specially formulated or processed for use by infants up to 12 months of age (e.g., macaroni and cheese dinner mixes. cobbler mixes, pudding mixes, fruit mixes, carrots with rice mixes). ",
          parent: foodParent.id,
        },
        {
          name: "Brownies",
          description: "All brownies",
          parent: foodParent.id,
        },
      ])
        .then((categories) =>
          console.log(`${categories.length} categories created`)
        )
        .catch((err) => console.log(err));
    }
  });
};
