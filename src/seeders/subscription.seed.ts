import { SubscriptionModel } from "models/subscription/subscription.model";
import dotenv from "dotenv";

dotenv.config();

export const seedSubscriptions = () => {
  SubscriptionModel.estimatedDocumentCount({}, (err, count) => {
    // RoleModel.collection.drop();
    if (!err && count === 0) {
      SubscriptionModel.insertMany([
        {
          name: "basic",
        },
        {
          name: "silver",
        },
        {
          name: "gold",
        },
      ])
        .then((roles) => console.log(`${roles.length} roles created`))
        .catch((err) => console.log(err));
    }
  });
};
