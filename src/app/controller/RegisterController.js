const status = require("http-status");
exports.register = async (req, res) => {
  const data = req.body;
  return res.status(status.OK).json(data);
};
