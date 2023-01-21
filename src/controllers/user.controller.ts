import { Request, Response } from "express";
import { UserModel } from "models/user/user.model";

// * SEARCH
// * ---------
export const findBySubId = async (req: Request, res: Response) => {
  const users = await UserModel.find({ subscription: req.params.subId });

  if (!users) {
    return res.status(404).json({ success: false, message: "Nothing found" });
  }

  res.status(200).json({
    success: true,
    message: `Found ${users.length} users`,
    data: users,
  });
};
