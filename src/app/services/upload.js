const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/jpg",
    "image/webp",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("file type not supported"), false);
  }
};

const uploadAvatarMiddleWare = multer({
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter,
});

module.exports = {
  uploadAvatarMiddleWare,
};
