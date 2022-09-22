import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { UserModel } from "models/user/user.model";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

dotenv.config();

const secret = (process.env.SECRET as string) || "";

export const signup = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorsMapped = errors
      .array()
      .map((err) => ({ param: err.param, message: err.msg }));

    return res.status(400).json({ errors: errorsMapped });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 8);

  try {
    const user = new UserModel({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" }).end();
  } catch (err) {
    res.status(500).json({ message: err }).end();
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    if (req.session.loggedIn) {
      res.status(401).json({
        message:
          "Already logged in, Please request a password reset if you suspect this is not you.",
      });
      return;
    }

    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      res.status(404).json({ message: "User Not found" });
      return;
    }

    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      res.status(401).json({
        accessToken: null,
        message: "Please enter valid email or password",
      });
      return;
    }

    const token = sign({ id: user.id, name: user.name }, secret);

    req.session.loggedIn = true;

    res.status(200).json({
      message: "Logged in successfully",
      // id: user._id,
      // name: user.name,
      // email: user.email,
      // phone: user.phone,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).json({ message: err });
    return;
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.loggedIn) {
    req.session.loggedIn = false;

    res.status(200).json({ message: "Logged out successfully" });
  } else {
    res.status(404).json({ message: "Not logged in" });
  }
};
