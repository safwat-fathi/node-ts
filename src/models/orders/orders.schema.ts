import { CallbackWithoutResultAndOptionalError, Schema } from "mongoose";
import { Order } from "types/db";
import { geocoder } from "utils/geocoder";

export const OrderSchema = new Schema<Order>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "{VALUE} can not be null"],
  },
  total: { type: Number, required: [true, "{VALUE} can not be null"] },
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "{VALUE} can not be null"],
          _id: false,
        },
        quantity: Number,
        _id: false,
      },
    ],
    required: [true, "{VALUE} can not be null"],
    validate: (val: { product: Schema.Types.ObjectId; quantity: number }[]) =>
      Array.isArray(val) && val.length > 0,
  },
  status: { type: String, required: [true, "{VALUE} can not be null"] },
  address: { type: String, required: [true, "{VALUE} can not be null"] },
  delivery: {
    type: Date,
    default: Date.now,
    required: [true, "{VALUE} can not be null"],
  },
});

// geocode & create address field
// OrderSchema.pre(
//   "save",
//   async function (next: CallbackWithoutResultAndOptionalError) {
//     const loc = await geocoder.geocode(this.address);

//     next();
//   }
// );
