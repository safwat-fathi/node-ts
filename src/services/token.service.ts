import { generateToken } from "@lib/utils/auth";
import { TokenModel } from "@/models/token/token.model";
import { TDoc, Token } from "@/types/db";
import { ITokenService } from "@/types/services";
import { Document, ObjectId, Types } from "mongoose";

export class TokenService implements Partial<ITokenService<Token>> {
  async add(doc: Token): Promise<TDoc<Token> | null> {
    try {
      const hasToken = await TokenModel.findOne({ userId: doc.userId });

      if (hasToken) {
        return null;
      }

      const newToken = new TokenModel(doc);

      await newToken.save();

      return newToken;
    } catch (err) {
      throw new Error(`TokenService::add::${err}`);
    }
  }

  async read(userId: ObjectId): Promise<TDoc<Token> | null> {
    try {
      const token = await TokenModel.findOne({ userId });

      if (!token) {
        return null;
      }

      return token;
    } catch (err) {
      throw new Error(`TokenService::read::${err}`);
    }
  }
}
