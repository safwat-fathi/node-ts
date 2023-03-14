import { model } from "mongoose";
import { Product } from "@/types/db";
import { ProductsSchema } from "./products.schema";

export const ProductModel = model<Product>("Product", ProductsSchema);
