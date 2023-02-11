import { UserModel } from "models/user/user.model";
import { hashPassword } from "utils/auth";
import dotenv from "dotenv";

dotenv.config();

export const seedUsers = async () => {
  UserModel.estimatedDocumentCount({}, async (err, count) => {
    // drop all stored docs
    UserModel.collection.drop();

    if (err) throw new Error(`${err}`);

    if (count === 0) {
      await UserModel.insertMany([
        {
          name: "Safwat",
          email: "test@example.com",
          phone: "01100000000",
          password: await hashPassword("123456789"),
        },
        {
          name: "Hamza",
          email: "test@example.com",
          phone: "01100000000",
          password: await hashPassword("123456789"),
        },
        {
          name: "Ali",
          email: "test@example.com",
          phone: "01100000000",
          password: await hashPassword("123456789"),
        },
      ]);
    }
  });
};
