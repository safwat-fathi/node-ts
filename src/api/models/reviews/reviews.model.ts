import { model } from "mongoose";
import { Review, ReviewDoc, StoreDB } from "types/db";
import { ReviewSchema } from "./reviews.schema";

export const ReviewModel = model<ReviewDoc>("Review", ReviewSchema);

export class ReviewStore implements Partial<StoreDB<Review>> {
  async create(newReview: Review): Promise<ReviewDoc> {
    try {
      const review = await ReviewModel.create(newReview);

      await review.save();

      return review;
    } catch (err) {
      throw new Error(`ReviewStore::create::${err}`);
    }
  }
}
