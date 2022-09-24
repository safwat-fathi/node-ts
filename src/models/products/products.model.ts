import { model } from "mongoose";
import { Product } from "types/db";
import { productSchema } from "./products.schema";

export const ProductModel = model<Product>("Product", productSchema);
