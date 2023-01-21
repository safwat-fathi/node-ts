// import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { SubscriptionStore } from "models/subscription/subscription.model";
import { generateAccessToken } from "utils/auth";
import { UserStore } from "models/user/user.model";
import { validationResult } from "express-validator";
import { HttpError } from "errors/http";

// dotenv.config();

// const secret = (process.env.SECRET as string) || "";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userStore = new UserStore();
    const subscriptionStore = new SubscriptionStore();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMapped = errors
        .array()
        .map(err => ({ param: err.param, message: err.msg }));

      return next(new HttpError(400, "Signup failed", errorsMapped));
    }

    const subscription = await subscriptionStore.show(req.body.subscription);

    if (!subscription) {
      return next(new HttpError(422, "subscription is not valid"));
    }

    const user = await userStore.signup({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      subscription: subscription.id,
      orders: [],
    });

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(new HttpError(500, `${err}`));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (req.session.loggedIn) {
      return res.status(401).json({
        success: false,
        error: {
          message:
            "Already logged in, Please request a password reset if you suspect this is not you.",
        },
      });
    }

    const userStore = new UserStore();

    const user = await userStore.login({ email, password });

    if (!user) {
      return next(new HttpError(422, "Please enter valid email or password"));
    }

    const token = generateAccessToken(user.id, user.name);

    req.session.loggedIn = true;

    res.status(200).json({
      success: true,
      data: {
        accessToken: token,
        user,
      },
    });
  } catch (err) {
    next(new HttpError(500, `${err}`));
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.session.loggedIn) {
      req.session.loggedIn = false;

      res.status(200).json({ success: true });
    } else {
      return next(new HttpError(404, "Not logged in"));
    }
  } catch (err) {
    next(new HttpError(500, `${err}`));
  }
};
