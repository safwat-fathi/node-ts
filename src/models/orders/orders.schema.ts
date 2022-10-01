import { Schema } from "mongoose";
import { Order } from "types/db";

export const OrderSchema = new Schema<Order>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  total: { type: Number, required: true },
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
          _id: false,
        },
        qty: Number,
        _id: false,
      },
    ],
    required: true,
    validate: (val: { product: Schema.Types.ObjectId; qty: number }[]) =>
      Array.isArray(val) && val.length > 0,
  },
  address: { type: String, required: true },
  delivery: { type: Date, default: Date.now, required: true },
});
