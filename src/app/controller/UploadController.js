const status = require("http-status");
const User = require("../../app/model/user");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../services/s3Client");
const { v4: uuidv4 } = require("uuid");

exports.uploadAvatar = async (req, res) => {
  try {
    const file = req.file;

    const fileName = `userUploads/${uuidv4()}-${file.originalname}`;
    const uploadParams = {
      Bucket: "amahane",
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    await s3Client.send(new PutObjectCommand(uploadParams));
    const avatar = `https://amahane.s3.ap-northeast-1.amazonaws.com/${fileName}`;

    const userModel = await User.getModel(req.dbConnetion);
    const userId = req.userId;
    const user = await userModel.findById(userId);
    user.avatar = avatar;
    await user.save();

    res.status(status.OK).send({ avatar });
  } catch (error) {
    console.log(error);
    return res
      .status(status.UNPROCESSABLE_ENTITY)
      .json({ error: error.message });
  }
};
