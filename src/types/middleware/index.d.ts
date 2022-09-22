// import Express from "express-serve-static-core";

// declare module "express-serve-static-core" {
//   interface Request {
//     email: string;
//     password: string;
//     userId?: string;
//   }
// }

import session from "express-session";

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
    userId: string;
  }
}
