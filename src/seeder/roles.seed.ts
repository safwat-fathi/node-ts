import { RoleModel } from "models/role/role.model";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "config/db.config";

dotenv.config();

export const seedRoles = () => {
  RoleModel.estimatedDocumentCount({}, (err, count) => {
    // RoleModel.collection.drop();
    if (!err && count === 0) {
      RoleModel.insertMany([
        {
          name: "user",
        },
        {
          name: "moderator",
        },
        {
          name: "admin",
        },
      ])
        .then((roles) => console.log(`${roles.length} roles created`))
        .catch((err) => console.log(err));
      // .finally(async () => await disconnectDB());
    }
  });
};
