import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { TSendEmailOptions } from "@/types/utils";

dotenv.config();

const {
  FROM_EMAIL,
  FROM_NAME,
  SMTP_EMAIL,
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SECRET,
} = (process.env as {
  SMTP_EMAIL: string;
  SMTP_HOST: string;
  SMTP_PASSWORD: string;
  SMTP_PORT: number;
  FROM_NAME: string;
  FROM_EMAIL: string;
  SECRET: string;
}) || {
  SECRET: "",
  SMTP_EMAIL: "",
  SMTP_HOST: "",
  SMTP_PASSWORD: "",
  SMTP_PORT: 2525,
  FROM_EMAIL: "",
  FROM_NAME: "",
};

/**
 * Hash given password
 * @param {string} password The password given
 * @returns {string} Returns hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (err) {
    throw new Error(`Utils::auth::hashPassword::${err}`);
  }
};

/**
 * Check given password match user password
 * @param {string} password The password given
 * @param {string} userPassword The user password
 * @returns {boolean} Returns true or false if given password does match user password
 */
export const comparePassword = async (
  password: string,
  userPassword: string
): Promise<boolean> => {
  try {
    const passwordIsValid = await bcrypt.compare(password, userPassword);

    return passwordIsValid;
  } catch (err) {
    throw new Error(`Utils::auth::comparePassword::${err}`);
  }
};

/**
 * Generate JWT access token
 * @param {string} id Unique user id
 * @param {string} name User name
 * @returns {string} Returns access token
 */
export const generateAccessToken = async (
  id: string,
  name: string,
): Promise<string> => {
  try {
    const token = sign({ id, name }, SECRET, {expiresIn: '24h'});

    return token;
  } catch (err) {
    throw new Error(`Utils::auth::generateAccessToken::${err}`);
  }
};

/**
 * Generate & hash password token
 * @returns {string} Returns password token
 */
export const generateResetPasswordToken = (): string => {
  try {
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hash token
    const resetpasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    return resetpasswordToken;
  } catch (err) {
    throw new Error(`Utils::auth::generateResetPasswordToken::${err}`);
  }
};

/**
 * Send email via nodemailer
 * @param {string} options message options
 * @returns {string} Returns access token
 */
export const sendEmail = async (options: TSendEmailOptions): Promise<void> => {
  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });

    const message = {
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      // html: "<b>Hello !</b>",
    };

    await transport.sendMail(message, (err, info) => {
      if (err) {
        throw new Error(`Sending email failed: ${err}`);
      }

      console.log("Message sent:", info.messageId, info.response);
    });
  } catch (err) {
    throw new Error(`Utils::auth::sendEmail::${err}`);
  }
};
