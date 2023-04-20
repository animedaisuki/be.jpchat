const jwt = require("jsonwebtoken");
const status = require("http-status");
const errorHandler = require("../helper/errorHandler");
const config = require("../config/app");
const User = require("../model/user");

exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(status.UNAUTHORIZED)
        .json({ error: errorHandler.UNAUTHORIZED });
    }
    const authType = authHeader.split(" ")[0];
    const authToken = authHeader.split(" ")[1];
    if (!authType || !authToken) {
      return res
        .status(status.UNAUTHORIZED)
        .json({ error: errorHandler.UNAUTHORIZED });
    }

    const { id } = jwt.verify(authToken, config.jwtSecrete);
    const user = await User.getModel(req.dbConnetion).findById(id);
    if (!user) {
      return res
        .status(status.UNAUTHORIZED)
        .json({ error: errorHandler.UNAUTHORIZED });
    }
    req.userId = user.id;
    req.username = user.username;
    req.email = user.email;
    req.avatar = user.avatar;
    req.voicePreference = user.voicePreference;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(status.UNPROCESSABLE_ENTITY)
      .json({ error: error.message });
  }
};
