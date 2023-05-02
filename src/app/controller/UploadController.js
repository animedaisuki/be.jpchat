const status = require("http-status");
const User = require("../../app/model/user");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../services/s3Client");
const { v4: uuidv4 } = require("uuid");

exports.uploadAvatar = async (req, res) => {
  try {
    const file = req.file;

    const fileName = `users/uploads/${uuidv4()}-${file.originalname}`;
    const uploadParams = {
      Bucket: "amahane",
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    await s3Client.send(new PutObjectCommand(uploadParams));
    const avatar = `https://amahane.s3.ap-northeast-1.amazonaws.com/${fileName}`;

    const defaultAvatars = [
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-gorou-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-jean-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-ayaka-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-collei-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-kazuha-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-keqing-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-itto-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-klee-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-mika-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-kokomi-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-kujou-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-nahida-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-shogun-samll.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-yoimiya-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-eula-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-razor-small.png",
    ];

    const userId = req.userId;
    const userModel = await User.getModel(req.dbConnetion);
    const user = await userModel.findById(userId);

    //delete old avatar if it does not belong to default avatars
    if (!defaultAvatars.includes(user.avatar)) {
      const getObjectKeyFromUrl = (avatar) => {
        const url = new URL(avatar);
        return url.pathname.substring(1);
      };
      const key = getObjectKeyFromUrl(user.avatar);
      const deleteParams = {
        Bucket: "amahane",
        Key: key,
      };
      await s3Client.send(new DeleteObjectCommand(deleteParams));
    }

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
