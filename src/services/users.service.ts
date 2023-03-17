import { comparePassword } from "@lib/utils/auth";
import { UserModel } from "@models/user/user.model";
import { Service, User, UserDoc } from "@/types/db";

export class UserService implements Partial<Service<User>> {
  async index(filter?: any | null): Promise<[User[], number]> {
    // TODO: apply pagination if needed
    try {
      const query = UserModel.find(
        // filter by model fields
        filter || {},
        // select model fields to return
        { name: 1, email: 1, phone: 1, address: 1, orders: 1 }
      );

      const [users, count] = await Promise.all([
        query.exec(),
        UserModel.estimatedDocumentCount(),
      ]);

      return [users, count];
    } catch (err) {
      throw new Error(`UserService::find::${err}`);
    }
  }

  async create(u: Partial<User>): Promise<UserDoc> {
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
      throw new Error(`UserService::signup::${err}`);
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
      throw new Error(`UserService::login::${err}`);
    }
  }
}
