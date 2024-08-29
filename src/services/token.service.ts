// import { generateToken } from "@/lib/utils/auth";
// import { TokenModel } from "@/models/token/token.model";
// import { TDoc, Token } from "@/types/db";
// import { ITokenService } from "@/types/services";
// import { ObjectId } from "mongoose";

// export class TokenService implements Partial<ITokenService<Token>> {
//   async add(doc: Token): Promise<TDoc<Token> | null> {
//     try {
//       const hasToken = await TokenModel.findOne({ userId: doc.userId });

//       if (hasToken) {
//         return null;
//       }

//       const newToken = new TokenModel(doc);

//       await newToken.save();

//       return newToken;
//     } catch (err) {
//       throw new Error(`TokenService::add::${err}`);
//     }
//   }

//   async read(token: string): Promise<boolean> {
//     try {
//       const userToken = await TokenModel.findOne({ token });

//       if (!userToken) {
//         return false;
//       }

//       return true;
//     } catch (err) {
//       throw new Error(`TokenService::read::${err}`);
//     }
//   }

//   async delete(tokenId: ObjectId): Promise<void> {
//     try {
//       const tokenToDelete = await TokenModel.findOne({ tokenId });

//       if (!tokenToDelete) {
//         throw new Error("No token found");
//       }

//       await tokenToDelete.deleteOne();
//     } catch (err) {
//       throw new Error(`TokenService::read::${err}`);
//     }
//   }
// }
