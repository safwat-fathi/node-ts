import { NextFunction, Request, Response } from "express";
import { UserModel } from "models/user/user.model";

export const checkDuplicate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = await UserModel.findOne({
      name: req.body.name,
    });

    const phone = await UserModel.findOne({
      phone: req.body.phone,
    });

    if (email) {
      res.status(400).json({ message: "Failed! Email is already in use!" });
      return;
    }

    if (phone) {
      res.status(400).json({ message: "Failed! Email is already in use!" });
      return;
    }
  } catch (err) {
    res.status(500).json({ message: err });
    return;
  }

  next();
};

export const checkRolesExisted = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!["user", "admin", "moderator"].includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });

        res.end();
      }
    }
  }

  next();
};
