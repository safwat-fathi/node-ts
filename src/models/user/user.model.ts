import { model } from "mongoose";
import { StoreDB, User, UserDoc } from "types/db";
import { UserSchema } from "./user.schema";
import { comparePassword } from "utils/auth";

export const UserModel = model<UserDoc>("User", UserSchema);

export class UserStore implements Partial<StoreDB<User>> {
  async signup(u: Partial<User>): Promise<UserDoc> {
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

  async login(u: Partial<User>): Promise<UserDoc | null> {
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

  async find(
    find:
      | {
          by: keyof User;
          value: any;
        }
      | {
          by: keyof User;
          value: any;
        }[]
  ): Promise<UserDoc | UserDoc[] | null> {
    try {
      let user = null;

      if (Array.isArray(find)) {
        let query = [];

        for (let i in find) {
          query.push({ [String(find[i].by)]: find[i].value });
        }

        user = await UserModel.find({
          $or: [query],
        });
      } else {
        user = await UserModel.find({ [String(find.by)]: find.value });
      }

      if (!user) {
        return null;
      }

      return user;
    } catch (err) {
      throw new Error(`error finding users ${err}`);
    }
  }
}
