import { UserModel } from "models/user/user.model";
import { SubscriptionModel } from "models/subscription/subscription.model";
import dotenv from "dotenv";

dotenv.config();

export const seedUsers = async () => {
  const basicSubscription = await SubscriptionModel.find({
    name: new RegExp("basic", "i"),
  });
};
