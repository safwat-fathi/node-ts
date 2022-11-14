import { model, ObjectId } from "mongoose";
import { Subscription } from "types/db";
import { subscriptionSchema } from "./subscription.schema";

export const SubscriptionModel = model<Subscription>(
  "Subscription",
  subscriptionSchema
);

export class SubscriptionStore {
  async show(subscriptionId: ObjectId): Promise<Subscription | null> {
    try {
      const subscription = await SubscriptionModel.findOne({
        id: subscriptionId,
      });

      if (!subscription) {
        return null;
      }

      return subscription;
    } catch (err) {
      throw new Error(`error getting subscription ${err}`);
    }
  }
}
