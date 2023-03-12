import { model } from "mongoose";
import { ReviewDoc } from "src/types/db";
import { ReviewSchema } from "./reviews.schema";

export const ReviewModel = model<ReviewDoc>("Review", ReviewSchema);
