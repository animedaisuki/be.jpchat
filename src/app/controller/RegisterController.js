const status = require("http-status");
const User = require("../model/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const config = require("../config/app");
const errorHandler = require("../helper/errorHandler");

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(status.UNPROCESSABLE_ENTITY)
        .json({ error: "validation error" });
    }

    const { email, username, password, checked } = req.body;

    if (!checked) {
      return res
        .status(status.FORBIDDEN)
        .json({ error: errorHandler.ILLEGAL_REGISTRATION });
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
    const hashedPass = await bcrypt.hash(password, Number(config.secrete));
    const user = new userModel({
      email,
      username,
      password: hashedPass,
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
