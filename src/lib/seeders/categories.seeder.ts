// import { CategoryModel } from "@/models/categories/categories.model";
// import dotenv from "dotenv";

// dotenv.config();

// export const seedCategories = async () => {
//   try {
//     CategoryModel.estimatedDocumentCount({}, async (err, count) => {
//       // drop all stored docs
//       // await CategoryModel.collection.drop();

//       // Rebuild all indexes
//       await CategoryModel.syncIndexes();

//       if (err) throw new Error(`${err}`);

//       if (count === 0) {
//         const parentClothsCategory = await new CategoryModel({
//           name: "Cloths",
//           description: "All Cloths",
//           parent: null,
//           sub: [],
//         });

//         await parentClothsCategory.save();

//         const categories = await CategoryModel.insertMany([
//           {
//             name: "Shirts",
//             description: "All Shirts",
//             parent: parentClothsCategory.id,
//             sub: [],
//           },
//           { name: "Food", description: "All food", parent: null, sub: [] },
//           { name: "Shoes", description: "All Shoes", parent: null, sub: [] },
//         ]);

//         if (categories.length) {
//           console.log(`${categories.length} category created`);
//         }
//       }
//     });
//   } catch (err) {
//     new Error(`Categories::seeder::${err}`);
//   }
// };
