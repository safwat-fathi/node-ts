import CryptoJS from "crypto-js";

export const slugify = (text: string) => {
  return (
    text
      // .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, "") // Trim - from end of text
  );
};

export const isSafeToParse = (v: string): boolean => {
  try {
    JSON.parse(v);
  } catch (err: unknown) {
    return false;
  }

  return true;
};

export const decrypt = (encrypted: string) => {
  // const ciphertext = CryptoJS.AES.encrypt(
  //   JSON.stringify(params),
  //   process.env.CIPHER_TEXT_SECRET
  // ).toString();
  const bytes = CryptoJS.AES.decrypt(encrypted, process.env.CIPHER_TEXT_SECRET);

  const originalText = bytes.toString(CryptoJS.enc.Utf8);

  return originalText;
};
