const status = require("http-status");
const User = require("../../app/model/user");
const bcrypt = require("bcrypt");
const errorHandler = require("../helper/errorHandler");
const jwt = require("jsonwebtoken");
const config = require("../config/app");

exports.index = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.getModel(req.dbConnetion).findOne({ email: email });
  if (!user) {
    return res
      .status(status.NOT_FOUND)
      .json({ error: errorHandler.ILLEGAL_LOGIN });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res
      .status(status.FORBIDDEN)
      .json({ error: errorHandler.ILLEGAL_LOGIN });
  }

  const token = jwt.sign({ id: user.id }, config.jwtSecrete, {
    expiresIn: "72h",
  });

  const userWithoutPassword = {
    id: user.id,
    username: user.username,
    email,
    avatar: user.avatar,
    token,
    voicePreference: user.voicePreference,
  };

  return res.status(status.OK).json(userWithoutPassword);
};
