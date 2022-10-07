import { Schema } from "mongoose";
import { User } from "types/db";

export const userSchema = new Schema<User>(
  {
    name: { type: String, required: true, match: /^[a-zA-Z ]*$/ },
    email: {
      type: String,
      required: true,
      match:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    phone: {
      type: String,
      required: true,
      match: /\d{3}\s?\d{4}-?\d{4}/gm,
    },
    password: { type: String, required: true },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
		orders: {
			type: [Schema.Types.ObjectId],
			ref: "Order",
			required: true
		}
  },
  {
    timestamps: true,
  }
);

// userSchema.pre("save", (next) => {
//   next();
// });
