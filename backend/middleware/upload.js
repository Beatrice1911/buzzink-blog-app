const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const ok = allowed.test(ext) && allowed.test(file.mimetype);
  ok ? cb(null, true) : cb(new Error("Only images allowed"));
};

module.exports = require("multer")({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
