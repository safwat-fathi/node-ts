import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { TSendEmailOptions } from "@/types/utils";

dotenv.config();

const { NODE_ENV, FROM_EMAIL, FROM_NAME, SMTP_EMAIL, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SECRET } = (process.env as {
  NODE_ENV: string;
  SMTP_EMAIL: string;
  SMTP_HOST: string;
  SMTP_PASSWORD: string;
  SMTP_PORT: number;
  FROM_NAME: string;
  FROM_EMAIL: string;
  SECRET: string;
}) || {
  NODE_ENV: "development",
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
    return await bcrypt.hash(password, salt);
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
export const comparePassword = async (password: string, userPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, userPassword);
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
export const generateAccessToken = async (id: string, name: string): Promise<string> => {
  try {
    return sign({ id, name }, SECRET, { expiresIn: "24h" });
  } catch (err) {
    throw new Error(`Utils::auth::generateAccessToken::${err}`);
  }
};

/**
 * Generate & hash token
 * @returns {string} Returns a token
 */
export const generateToken = (): string => {
  try {
    const token = crypto.randomBytes(16).toString("hex");

    // hash token
    return crypto.createHash("sha256").update(token).digest("hex");
  } catch (err) {
    throw new Error(`Utils::auth::generateToken::${err}`);
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
      port: +SMTP_PORT,
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
      debug: NODE_ENV === "development" ? true : false,
      logger: true,
    });

    const message = {
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    transport.sendMail(message, (err) => {
      if (err) {
        throw new Error(`Sending email failed: ${err}`);
      }
    });
  } catch (err) {
    throw new Error(`Utils::auth::sendEmail::${err}`);
  }
};
