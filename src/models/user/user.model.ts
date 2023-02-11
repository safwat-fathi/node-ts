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
      let users: any = [];

      if (Array.isArray(find)) {
        let query: any = [];

        for (let i in find) {
          query = [...query, { [String(find[i].by)]: find[i].value }];
        }

        users = await UserModel.find({
          $or: query,
        });
      } else {
        users = await UserModel.findOne({ [String(find.by)]: find.value });
      }

      if (!users || users.length === 0) {
        return null;
      }

      return users;
    } catch (err) {
      throw new Error(`error finding users ${err}`);
    }
  }
}
