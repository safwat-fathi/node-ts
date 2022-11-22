import dotenv from "dotenv";
import { Request, Response } from "express";
import { SubscriptionStore } from "models/subscription/subscription.model";
import { generateAccessToken } from "utils/auth";
import { UserStore } from "models/user/user.model";
import { validationResult } from "express-validator";

dotenv.config();

const secret = (process.env.SECRET as string) || "";

export const signup = async (req: Request, res: Response) => {
  try {
    const userStore = new UserStore();
    const subscriptionStore = new SubscriptionStore();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMapped = errors
        .array()
        .map((err) => ({ param: err.param, message: err.msg }));

      return res.status(400).json({ errors: errorsMapped });
    }

    const subscription = await subscriptionStore.show(req.body.subscription);

    if (!subscription) {
      res.status(422).json({ message: "subscription is not valid" });
      return;
    }

    const user = await userStore.signup({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      subscription: subscription.id,
      orders: [],
    });

    res
      .status(201)
      .json({ user, message: "User registered successfully" })
      .end();
  } catch (err) {
    res.status(500).json({ message: err }).end();
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (req.session.loggedIn) {
      return res.status(401).json({
        message:
          "Already logged in, Please request a password reset if you suspect this is not you.",
      });
    }

    const userStore = new UserStore();

    const user = await userStore.login({ email, password });

    if (!user) {
      return res
        .status(422)
        .json({ message: "Please enter valid email or password" });
    }

    const token = generateAccessToken(user.id, user.name);

    req.session.loggedIn = true;

    res.status(200).json({
      message: "Logged in successfully",
      data: {
        accessToken: token,
        user,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err });
    return;
  }
};

export const logout = (req: Request, res: Response) => {
  if (req.session.loggedIn) {
    req.session.loggedIn = false;

    res.status(200).json({ message: "Logged out successfully" });
  } else {
    res.status(404).json({ message: "Not logged in" });
  }
};
