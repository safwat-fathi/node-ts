import { model } from "mongoose";
import { ProductDoc } from "@/types/db";
import { ProductsSchema } from "./products.schema";

export const ProductModel = model<ProductDoc>("Product", ProductsSchema);

// (async () => {
//   const i = await ProductModel.collection.getIndexes();

//   console.log("🚀 ~ i:", i);
// })();
