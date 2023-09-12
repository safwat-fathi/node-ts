import multer, { Options } from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads", // recommended to be outside of source-code '../uploads'
  filename: function (_, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);

    const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;

    cb(null, fileName);
  },
});

const fileSize = 2 * 1024 * 1024; // 2MB

const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

const fileFilter: Options["fileFilter"] = (_, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({ storage, limits: { fileSize }, fileFilter });
