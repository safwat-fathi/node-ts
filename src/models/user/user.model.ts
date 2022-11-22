import { model } from "mongoose";
import { User } from "types/db";
import { userSchema } from "./user.schema";
import { hashPassword } from "utils/auth";

export const UserModel = model<User>("User", userSchema);

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
}
