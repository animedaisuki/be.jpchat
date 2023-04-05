const status = require("http-status");
const User = require("../model/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const config = require("../config/app");
const errorHandler = require("../helper/errorHandler");
const { verify } = require("hcaptcha");

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(status.UNPROCESSABLE_ENTITY)
        .json({ error: "validation error" });
    }

    const { email, username, password, checked, token } = req.body;

    if (!checked) {
      return res
        .status(status.FORBIDDEN)
        .json({ error: errorHandler.ILLEGAL_REGISTRATION });
    }

    if (email === "" || username === "" || password === "") {
      return res
        .status(status.FORBIDDEN)
        .json({ error: errorHandler.EMPTY_INPUT });
    }

    const userModel = User.getModel(req.dbConnetion);
    const isEmailExists = await userModel.findOne({ email: email });
    const isUsernameExists = await userModel.findOne({ username: username });
    if (isEmailExists) {
      return res
        .status(status.FORBIDDEN)
        .json({ error: errorHandler.EMAIL_DUPLICATION });
    }
    if (isUsernameExists) {
      return res
        .status(status.FORBIDDEN)
        .json({ error: errorHandler.USERNAME_DUPLICATION });
    }
    const verifyResult = await verify(config.hCaptchaSecret, token);

    if (!verifyResult.success) {
      return res
        .status(status.FORBIDDEN)
        .json({ error: errorHandler.HCAPTCHA_DECLINED });
    }

    const defaultAvatars = [
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-ayaka-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-collei-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-kazuha-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-keqing-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-klee-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-kokomi-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-kujou-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-nahida-small.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-shogun-samll.png",
      "https://amahane.s3.ap-northeast-1.amazonaws.com/users/defaultAvatar/char-yoimiya-small.png",
    ];
    const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
    const hashedPass = await bcrypt.hash(password, Number(config.secrete));

    const user = new userModel({
      email,
      username,
      password: hashedPass,
      avatar: defaultAvatars[randomIndex],
    });

    await user.save();
    return res
      .status(status.OK)
      .json({ message: "a new account has been created" });
  } catch (error) {
    console.log(error);
    return res
      .status(status.UNPROCESSABLE_ENTITY)
      .json({ error: error.message });
  }
};
