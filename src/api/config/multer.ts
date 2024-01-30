import type { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

import { UPLOAD_PATH } from "../constants";

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  // allow PNG only, reject other files
  if (file.mimetype === "image/png") cb(null, true);
  else
    return cb(
      new Error("File type not supported. Only PNG files can be uploaded")
    );
};

export const upload = multer({ storage: storage, fileFilter });
