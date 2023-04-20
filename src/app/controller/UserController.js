const status = require("http-status");
const User = require("../model/user");

exports.autoFetch = async (req, res) => {
  const userWithoutPassword = {
    id: req.userId,
    username: req.username,
    email: req.email,
    avatar: req.avatar,
    voicePreference: req.voicePreference,
  };
  return res.status(status.OK).json(userWithoutPassword);
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const userModel = await User.getModel(req.dbConnetion);
    const user = await userModel.findById(userId);
    return res.status(status.OK).json(user);
  } catch (error) {
    console.log(error);
    return res
      .status(status.UNPROCESSABLE_ENTITY)
      .json({ error: error.message });
  }
};

exports.changeVoicePreference = async (req, res) => {
  try {
    const { userId } = req.body;
    const userModel = await User.getModel(req.dbConnetion);
    const user = await userModel.findById(userId);
    if (user.voicePreference === "CN") {
      user.voicePreference = "JP";
    } else {
      user.voicePreference = "CN";
    }
    await user.save();
    return res.status(status.OK).json(user);
  } catch (error) {
    console.log(error);
    return res
      .status(status.UNPROCESSABLE_ENTITY)
      .json({ error: error.message });
  }
};
