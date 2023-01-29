import { model, ObjectId } from "mongoose";
import { Subscription } from "types/db";
import { SubscriptionSchema } from "./subscription.schema";
import { StoreDB } from "types/db";

export const SubscriptionModel = model<Subscription>(
  "Subscription",
  SubscriptionSchema
);

export class SubscriptionStore implements StoreDB<Subscription> {
  async index(): Promise<{
    data: Subscription[];
  }> {
    try {
      const subscriptions = await SubscriptionModel.find({});

      return { data: subscriptions };
    } catch (err) {
      throw new Error(`error indexing subscriptions ${err}`);
    }
  }

  async find(findBy: {
    by: string;
    value: any;
  }): Promise<Subscription | Subscription[] | null> {
    try {
      const subscription: Subscription | Subscription[] =
        await SubscriptionModel.find({
          [findBy.by]: findBy.value,
        });

      if (!subscription) {
        return null;
      }

      return { data: subscription };
    } catch (err) {
      throw new Error(`error getting subscription ${err}`);
    }
  }
}
