export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

export const isSafeToParse = (v: string): boolean => {
  try {
    JSON.parse(v);
  } catch (err: unknown) {
    return false;
  }

  return true;
};

export const encode = (str: string): string =>
  Buffer.from(str).toString("base64");

export const decode = (str: string): string =>
  Buffer.from(str, "base64").toString("ascii");
