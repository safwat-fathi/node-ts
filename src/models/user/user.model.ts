import { model } from "mongoose";
import { User } from "types/db";
import { UserSchema } from "./user.schema";
import { hashPassword, comparePassword } from "utils/auth";

export const UserModel = model<User>("User", UserSchema);

export class UserStore {
  async signup(u: Partial<User>): Promise<User> {
    try {
      // hash password
      const hashedPassword = await hashPassword(u.password as string);

      const user = new UserModel({
        name: u.name,
        email: u.email,
        phone: u.phone,
        password: hashedPassword,
        subscription: u.subscription,
        orders: [],
      });

      await user.save();

      return user;
    } catch (err) {
      throw new Error(`error user signup ${err}`);
    }
  }

  async login(u: Partial<User>): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ email: u.email });

      if (!user) {
        return null;
      }

      const passwordIsValid = await comparePassword(
        u.password as string,
        user.password
      );

      if (!passwordIsValid) {
        return null;
      }

      return user;
    } catch (err) {
      throw new Error(`error user login. Error: ${err}`);
    }
  }
}
