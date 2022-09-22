import dotenv from "dotenv";
import { Request, Response } from "express";
import { UserModel } from "models/user/user.model";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

dotenv.config();

export const signup = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");

  const errors = validationResult(req);

  console.log("errors:", errors);
  if (!errors.isEmpty()) {
    const errorsMapped = errors
      .array()
      .map((err) => ({ param: err.param, message: err.msg }));

    return res.status(400).json({ errors: errorsMapped });
  }

  console.log("No errors");
  console.log(req.body);

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
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      res.status(404).json({ message: "User Not found" });
      return;
    }
    console.log(user);

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

    const token = sign({ id: user._id }, process.env.SECRET as string, {
      algorithm: "HS256",
      expiresIn: 86400,
    });

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
