import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "models/user/user.model";
import { RoleModel } from "models/role/role.model";
import { verify } from "jsonwebtoken";

dotenv.config();

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.headers.authorization;

  if (!token) {
    res.status(403).json({ message: "unauthorized" });
  }

  const decoded = verify(token, process.env.SECRET as string);
};
