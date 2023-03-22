const status = require("http-status");

exports.index = async (req, res) => {
  const data = req.body;
  return res.status(status.OK).json(data);
};
