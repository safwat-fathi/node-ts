import { Schema } from "mongoose";
import { OrderDoc } from "types/db";
// import { geocoder } from "lib/utils/geocoder";

export const OrderSchema = new Schema<OrderDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "{VALUE} can not be null"],
    },
    total: {
      type: Number,
      required: [true, "{VALUE} can not be null"],
    },
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
    status: {
      type: String,
      enum: {
        // active: still in user cart user
        // confirmed: confirmed by user
        // on-route: confirmed by seller
        // delivered: delivered to user
        // cancelled: cancelled by user
        // terminated: cancelled by seller
        values: [
          "active",
          "confirmed",
          "on-route",
          "delivered",
          "cancelled",
          "terminated",
        ],
        default: "active",
        message: "{VALUE} is not supported",
      },
      required: [true, "{VALUE} can not be null"],
    },
    address: {
      type: String,
      required: [true, "{VALUE} can not be null"],
    },
    delivery: {
      type: Date,
      default: Date.now,
      required: [true, "{VALUE} can not be null"],
    },
  },
  {
    timestamps: true,
  }
);

// geocode & create address field
// OrderSchema.pre<OrderDoc>(
//   "save",
//   async function (next: CallbackWithoutResultAndOptionalError) {
//     const loc = await geocoder.geocode(this.address);

//     next();
//   }
// );
