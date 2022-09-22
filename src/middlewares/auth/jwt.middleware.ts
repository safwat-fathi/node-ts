import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
// import { UserModel } from "models/user/user.model";
// import { RoleModel } from "models/role/role.model";
import { verify } from "jsonwebtoken";
import { CustomJwtPayload } from "types/jwt";

dotenv.config();

const secret = (process.env.SECRET as string) || "";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.headers.authorization?.split("  ")[1] || "";
  console.log(token);

  if (!token) {
    res.status(401).json({ message: "Unauthorized" }).end();
    return;
  }

  try {
    const decoded = verify(token, secret) as CustomJwtPayload;

    req.body.userId = decoded.id;

    next();
  } catch (err) {
    res.status(401).json({ message: err }).end();
  }
};
