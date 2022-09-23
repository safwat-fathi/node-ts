import { Schema } from "mongoose";
import { Product } from "types/db";

export const ProductSchema = new Schema<Product>({
  name: { type: String, required: true },
});
