// declare module "express-serve-static-core" {
//   interface Request {
//     test: string;
//   }
// }
import { Request } from "express";

export interface CustomRequest extends Request {
  userId?: string;
}
