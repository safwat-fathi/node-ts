import { model } from "mongoose";
import { Subscription } from "types/db";
import { subscriptionSchema } from "./subscription.schema";

export const SubscriptionModel = model<Subscription>(
  "Subscription",
  subscriptionSchema
);
