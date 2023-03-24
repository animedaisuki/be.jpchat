const status = require("http-status");
const User = require("../model/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const config = require("../config/app");

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("validation error");
    }

    const { email, username, password } = req.body;
    const userModel = User.getModel(req.dbConnetion);
    const isEmailExists = await userModel.findOne({ email: email });
    const isUsernameExists = await userModel.findOne({ username: username });
    if (isEmailExists) {
      throw new Error("email has already exists");
    }
    if (isUsernameExists) {
      throw new Error("username has already exists");
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
