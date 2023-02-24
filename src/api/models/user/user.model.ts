import { model } from "mongoose";
import { StoreDB, TFindBy, User, UserDoc } from "types/db";
import { UserSchema } from "./user.schema";
import { comparePassword } from "lib/utils/auth";

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
      throw new Error(`UserStore::signup::${err}`);
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
      throw new Error(`UserStore::login::${err}`);
    }
  }

  async find(
    find: TFindBy<User> | TFindBy<User>[]
  ): Promise<UserDoc | UserDoc[] | null> {
    try {
      let users: UserDoc | UserDoc[] | null = [];

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

      if (!users) {
        return null;
      }

      return users;
    } catch (err) {
      throw new Error(`UserStore::find::${err}`);
    }
  }
}
