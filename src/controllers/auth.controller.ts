import { Request, Response, NextFunction } from "express";
import { UserModel } from "models/user/user.model";
// import { RoleModel } from "models/role/role.model";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

export const signUp = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  console.log(req.body);

  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() }).end();

  try {
    const user = new UserModel({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 8),
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" }).end();
  } catch (err) {
    res.status(500).json({ message: err }).end();
  }
};

export const signIn = async (req: Request, res: Response) => {};
