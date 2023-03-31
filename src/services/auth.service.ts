import { comparePassword, generateToken, sendEmail } from "@/lib/utils/auth";
import dotenv from "dotenv";
import { UserModel } from "@/models/user/user.model";
import { TokenModel } from "@/models/token/token.model";
import { TDoc, User, UserDoc } from "@/types/db";
import { IAuthService } from "@/types/services";
import { TokenService } from "./token.service";

dotenv.config();

const {
  NODE_ENV,
  CLIENT_HOST_DEV,
  CLIENT_PORT_DEV,
  CLIENT_HOST_PROD,
  CLIENT_PORT_PROD,
} = (process.env as {
  NODE_ENV: "development" | "production";
  CLIENT_HOST_DEV: string;
  CLIENT_PORT_DEV: number;
  CLIENT_HOST_PROD: string;
  CLIENT_PORT_PROD: number;
}) || {
  NODE_ENV: "development",
  CLIENT_HOST_DEV: "",
  CLIENT_HOST_PROD: "",
  CLIENT_PORT_DEV: 3000,
  CLIENT_PORT_PROD: 3000,
};

const CLIENT_HOST =
  NODE_ENV === "development"
    ? `${CLIENT_HOST_DEV}:${CLIENT_PORT_DEV}`
    : `${CLIENT_HOST_PROD}:${CLIENT_PORT_PROD}`;

const tokenService = new TokenService();

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
      // create new user doc
      const user = new UserModel({
        name: u.name,
        email: u.email,
        phone: u.phone,
        password: u.password,
      });

      // token generation & new token doc
      const generatedToken = generateToken();
      const token = await tokenService.add({
        userId: user.id,
        token: generatedToken,
      });

      if (!token) {
        throw new Error("Signup failed, token generation failed");
      }

      // link to reset password page
      const verificationUrl = `${CLIENT_HOST}/auth/verification/${generatedToken}`;

      // TODO: message template should be HTML
      // message template
      const message = `<p>Please follow <a href="${verificationUrl}">this link</a> to complete registration process.</p>`;

      // send verification email
      await sendEmail({
        email: user.email,
        message,
        subject: "Email verification",
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

  async verifyEmail(token: string): Promise<boolean> {
    try {
      const userToken = await TokenModel.findOne({ token });

      if (!userToken) {
        return false;
      }

      const user = await UserModel.findOne({ _id: userToken.userId });

      if (!user || user.isVerified) {
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
