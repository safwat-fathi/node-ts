import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "models/user/user.model";
import { RoleModel } from "models/role/role.model";
import { verify } from "jsonwebtoken";
import { CustomJwtPayload } from "types/jwt";

dotenv.config();

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.headers.authorization || "";

  if (!token) {
    res.status(403).json({ message: "No token provided" }).end();
  }

  try {
    const decoded = (await verify(
      token,
      process.env.SECRET as string
    )) as CustomJwtPayload;

    req.body.userId = decoded.user.id;

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" }).end();
  }
};
