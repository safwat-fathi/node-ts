import bcrypt from "bcryptjs";

/**
 * Hash given password
 * @param {string} password The password given
 * @returns {string} Returns hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(16);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (err) {
    throw new Error(`error hashing password ${err}`);
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
    throw new Error(`error comparing password ${err}`);
  }
};
