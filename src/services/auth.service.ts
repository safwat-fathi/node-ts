import { comparePassword, generateResetPasswordToken } from "@lib/utils/auth";
import { UserModel } from "@models/user/user.model";
import { TDoc, User, UserDoc } from "@/types/db";

export interface IAuthService<T> {
  signup(newDoc: T): Promise<TDoc<T>> | null;
  update(docToUpdate: T): Promise<TDoc<T>>;
  forgotPassword(email: string): Promise<string | null>;
  login(doc: T): Promise<TDoc<T> | null>;
}

export class AuthService implements Partial<IAuthService<User>> {
  async forgotPassword(email: string): Promise<string | null> {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return null;
      }

      const resetpasswordToken = generateResetPasswordToken();

      user.resetPasswordToken = resetpasswordToken;
      user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expire time

      await user.save();

      return resetpasswordToken;
    } catch (err) {
      throw new Error(`AuthService::forgotPassword::${err}`);
    }
  }

  async signup(u: Partial<User>): Promise<UserDoc> {
    try {
      const user = new UserModel({
        name: u.name,
        email: u.email,
        phone: u.phone,
        password: u.password,
        orders: [],
      });

      await user.save();

      return user;
    } catch (err) {
      throw new Error(`AuthService::signup::${err}`);
    }
  }

  async login(u: Partial<User>): Promise<UserDoc | null> {
    try {
      const user = await UserModel.findOne({ email: u.email }).select(
        "+password"
      );

      if (!user) {
        return null;
      }

      const passwordIsValid = await comparePassword(
        <string>u.password,
        user.password
      );

      if (!passwordIsValid) {
        return null;
      }

      return user;
    } catch (err) {
      throw new Error(`AuthService::login::${err}`);
    }
  }
}
