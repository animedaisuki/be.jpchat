const status = require("http-status");

exports.autoFetch = async (req, res) => {
  const userWithoutPassword = {
    id: req.userId,
    username: req.username,
    email: req.email,
    avatar: req.avatar,
  };
  return res.status(status.OK).json(userWithoutPassword);
};
