import { Schema } from "mongoose";
import { Order, OrderDoc, OrderStatusEnum } from "@/types/db";
// import { geocoder } from "@/lib/utils/geocoder";

const STATUSES = [
  0, // active: still in user cart
  1, // confirmed: confirmed by user
  2, // on-route: confirmed by seller
  3, // delivered: delivered to user
  4, // cancelled: cancelled by user
  5, // terminated: cancelled by seller
];

export const OrderSchema = new Schema<Order>(
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
      index: true,
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
    toJSON: {
      virtuals: true,
      transform: function (doc: OrderDoc, ret: Partial<OrderDoc>, opt) {
        delete ret["__v"];
        return ret;
      },
    },
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
