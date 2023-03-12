import { ReviewModel } from "src/models//reviews/reviews.model";
import { Review, ReviewDoc } from "src/types/db";

export class ReviewService {
  async create(newReview: Review): Promise<ReviewDoc> {
    try {
      const review = await ReviewModel.create(newReview);

      await review.save();

      return review;
    } catch (err) {
      throw new Error(`ReviewService::create::${err}`);
    }
  }
}
