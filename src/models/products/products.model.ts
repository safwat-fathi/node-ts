import { model } from "mongoose";
import { Product } from "src/types/db";
import { ProductsSchema } from "./products.schema";

export const ProductModel = model<Product>("Product", ProductsSchema);
