import { NextFunction, Request, Response } from "express";
// import { PAGINATION_PARAMS } from "lib/constants";
import { Product, StoreDB, TQuery } from "types/db";
import { asyncHandler } from "./async.middleware";
import CryptoJS from "crypto-js";
import { decrypt } from "lib/utils/string";
// import { ProductsModel } from "api/models/products/products.model";
// const crypt = (salt: string, text: string) => {
//   const textToChars = (text: string): number[] =>
//     text.split("").map(c => c.charCodeAt(0));
//   const byteHex = (n: number): string =>
//     ("0" + Number(n).toString(16)).substring(-2);
//   const applySaltToChar = (code: any) =>
//     textToChars(salt).reduce((a, b) => a ^ b, code);

//   return text
//     .split("")
//     .map(textToChars)
//     .map(applySaltToChar)
//     .map(byteHex)
//     .join("");
// };

// const decrypt = (salt: string, encoded: string) => {
//   const textToChars = (text: string) =>
//     text.split("").map(c => c.charCodeAt(0));
//   const applySaltToChar = (code: any) =>
//     textToChars(salt).reduce((a, b) => a ^ b, code);

//   return encoded
//     .match(/.{1,2}/g)
//     ?.map((hex: string) => parseInt(hex, 16))
//     .map(applySaltToChar)
//     .map((charCode: number) => String.fromCharCode(charCode))
//     .join("");
// };

export const filter = <T>(filter: StoreDB<T>["filter"]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const params = { ...req.query };
    // console.log("🚀 ~ asyncHandler ~ params:", params);
    // const crypted = crypt("salt", "Safwat");
    // const decrypted = decrypt("salt", crypted);
    // console.log("🚀 ~ asyncHandler ~ decrypted:", decrypted);

    const cipheredParams = CryptoJS.AES.encrypt(
      JSON.stringify(params),
      process.env.CIPHER_TEXT_SECRET
    ).toString();
    console.log("🚀 ~ asyncHandler ~ cipheredParams:", cipheredParams);
    // console.log(
    //   "🚀 ~ asyncHandler ~ cipheredParams:",
    //   Buffer.from(cipheredParams).toString("base64")
    // );
    const originalParams = decrypt(cipheredParams);
    console.log(
      "🚀 ~ asyncHandler ~ originalParams:",
      JSON.parse(originalParams)
    );

    // const data = await filter(params);

    // res.locals.dataFiltered = data;
    next();
  });
