import { fileExist } from "@/lib/utils/fs";
import multer, { Options } from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads", // recommended to be outside of source-code '../uploads'
  filename: async function (_, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // const fileExtension = path.extname(file.originalname);

    // const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
    const uploadsDir = path.join(__dirname, "../../uploads");

    let filename = file.originalname;

    const doesExist = await fileExist(`${uploadsDir}/${filename}`);

    if (doesExist) filename = Date.now() + "-" + filename;

    cb(null, filename);
  },
});

const fileSize = 2 * 1024 * 1024; // 2MB

const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];

const fileFilter: Options["fileFilter"] = (_, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({ storage, limits: { fileSize }, fileFilter });
