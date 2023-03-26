import { Schema } from "mongoose";
import { OrderDoc, OrderStatusEnum } from "@/types/db/index.d";
// import { geocoder } from "@lib/utils/geocoder";

const STATUSES = [
  1, // active: still in user cart
  2, // confirmed: confirmed by user
  3, // on-route: confirmed by seller
  4, // delivered: delivered to user
  5, // cancelled: cancelled by user
  6, // terminated: cancelled by seller
];

export const OrderSchema = new Schema<OrderDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "{VALUE} can not be null"],
    },
    total: {
      type: Number,
      // required: [true, "{VALUE} can not be null"],
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
      type: Number,
      enum: {
        values: STATUSES,
        message: "{VALUE} is not supported",
      },
      default: OrderStatusEnum.Active,
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
