import { CallbackWithoutResultAndOptionalError, Schema } from "mongoose";
import { Upload, UploadDoc } from "@/types/db";
import { hashPassword } from "@/lib/utils/auth";

export const UploadSchema = new Schema<Upload>(
  {
    name: {
      type: String,
      required: [true, "{VALUE} can not be null"],
    },
    url: {
      type: String,
      required: [true, "{VALUE} can not be null"],
    },
    // user: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    //   required: [true, "{VALUE} can not be null"],
    // }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc: UploadDoc, ret: Partial<UploadDoc>, opt) {
        delete ret["_id"];
        delete ret["__v"];
        return ret;
      },
    },
  }
);

// UploadSchema.pre<UploadDoc>(
//   "save",
//   async function (next: CallbackWithoutResultAndOptionalError) {
//     // run password hash only if password modified
//     if (this.isModified("password")) {
//       // hash password
//       const hashedPassword = await hashPassword(this.password);

//       this.password = hashedPassword;
//     }

//     next();
//   }
// );
