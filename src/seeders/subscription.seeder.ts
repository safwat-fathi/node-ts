// import { SubscriptionModel } from "models/subscription/subscription.model";
// import dotenv from "dotenv";

// dotenv.config();

// export const seedSubscriptions = () => {
//   SubscriptionModel.estimatedDocumentCount({}, (err, count) => {
//     // RoleModel.collection.drop();
//     if (!err && count === 0) {
//       SubscriptionModel.insertMany([
//         {
//           name: "basic",
//         },
//         {
//           name: "silver",
//         },
//         {
//           name: "gold",
//         },
//       ])
//         .then((subscriptions) =>
//           console.log(`${subscriptions.length} subscriptions created`)
//         )
//         .catch((err) => console.log("Subscriptions seeder error:", err));
//     }
//   });
// };
