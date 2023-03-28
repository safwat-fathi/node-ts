import { comparePassword, generateToken } from "@lib/utils/auth";
import { UserModel } from "@models/user/user.model";
import { TDoc, User, UserDoc } from "@/types/db";
import { IAuthService } from "@/types/services";

export class AuthService implements Partial<IAuthService<User>> {
  async forgotPassword(email: string): Promise<string | null> {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return null;
      }

      const resetPasswordToken = generateToken();

      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expire time

      await user.save();

      return resetPasswordToken;
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

  async verifyEmail(email: string): Promise<boolean> {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return false;
      }

      user.isVerified = true;
      await user.save();

      return true;
    } catch (err) {
      throw new Error(`AuthService::verifyEmail::${err}`);
    }
  }
}
