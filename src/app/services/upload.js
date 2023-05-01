const multer = require("multer");

const storage = multer.memoryStorage();

const uploadAvatarMiddleWare = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

module.exports = {
  uploadAvatarMiddleWare,
};
