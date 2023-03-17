import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = (process.env.SECRET as string) || "";

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
  name: string
): Promise<string> => {
  try {
    const token = sign({ id, name }, secret);

    return token;
  } catch (err) {
    throw new Error(`Utils::auth::generateAccessToken::${err}`);
  }
};
