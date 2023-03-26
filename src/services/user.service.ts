import { comparePassword, generateResetPasswordToken } from "@lib/utils/auth";
import { UserModel } from "@models/user/user.model";
import { User, UserDoc } from "@/types/db";

export class UserService {
  async find(u: Partial<User>): Promise<UserDoc | null> {
    try {
      const user = await UserModel.findOne({ email: u.email });

      if (!user) {
        return null;
      }

      return user;
    } catch (err) {
      throw new Error(`UserService::find::${err}`);
    }
  }
}
