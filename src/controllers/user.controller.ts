import { Request, Response } from "express";
import { UserModel } from "models/user/user.model";

// * SEARCH
// * ---------
export const findBySubId = async (req: Request, res: Response) => {
  const users = await UserModel.find({ subscription: req.params.subId });

  if (!users) {
    res.status(404).json({ message: "Nothing found" });
    return;
  }

  res.status(200).json({ message: `Found ${users.length} users`, data: users });
};
