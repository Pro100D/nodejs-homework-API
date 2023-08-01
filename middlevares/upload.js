import multer from "multer";
import path from "path";

const tempDir = path.resolve("temp");

const multierConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multierConfig,
});

export default upload;
