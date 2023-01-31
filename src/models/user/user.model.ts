import { model } from "mongoose";
import { User, UserDoc } from "types/db";
import { UserSchema } from "./user.schema";
import { comparePassword } from "utils/auth";

export const UserModel = model<UserDoc>("User", UserSchema);

export class UserStore {
  async signup(u: Partial<User>): Promise<User> {
    try {
      const user = new UserModel({
        name: u.name,
        email: u.email,
        phone: u.phone,
        password: u.password,
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
        <string>u.password,
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
