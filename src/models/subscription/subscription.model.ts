import { model, ObjectId } from "mongoose";
import { Subscription, SubscriptionDoc } from "types/db";
import { SubscriptionSchema } from "./subscription.schema";
import { StoreDB } from "types/db";

export const SubscriptionModel = model<SubscriptionDoc>(
  "Subscription",
  SubscriptionSchema
);

export class SubscriptionStore implements Partial<StoreDB<Subscription>> {
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

  async find(find: {
    by: { [key in keyof Subscription]: string };
    value: any;
  }): Promise<{ data: Subscription | Subscription[] } | null> {
    try {
      const subscription: Subscription | Subscription[] =
        await SubscriptionModel.find({
          [String(find.by)]: find.value,
        });

      if (!subscription) {
        return null;
      }

      return { data: subscription };
    } catch (err) {
      throw new Error(`error finding subscriptions ${err}`);
    }
  }
}
