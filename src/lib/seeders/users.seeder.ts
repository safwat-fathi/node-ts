// import { UserModel } from "@/models/user/user.model";
// import { hashPassword } from "@/lib/utils/auth";
// import dotenv from "dotenv";

// dotenv.config();

// export const seedUsers = () => {
//   UserModel.estimatedDocumentCount({}, async (err, count) => {
//     // drop all stored docs
//     // await UserModel.collection.drop();

//     // Rebuild all indexes
//     await UserModel.syncIndexes();

//     if (err) throw new Error(`seedUsers::${err}`);

//     if (count === 0) {
//       UserModel.collection
//         .insertMany([
//           {
//             name: "Safwat",
//             email: "test1@gmail.com",
//             phone: "01100000001",
//             password: await hashPassword("123456789"),
//             address: "cairo - el nozha",
//           },
//           {
//             name: "Hamza",
//             email: "test2@example.com",
//             phone: "01100000002",
//             password: await hashPassword("123456789"),
//             address: "giza - zayed",
//           },
//           {
//             name: "Ali",
//             email: "test3@example.com",
//             phone: "01100000003",
//             password: await hashPassword("123456789"),
//             address: "alexandria - Kafr abdo",
//           },
//         ])
//         .then(users => console.log(`${users.insertedCount} users created`))
//         .catch(err => new Error(`Users::seeder::${err}`));
//     }
//   });
// };
