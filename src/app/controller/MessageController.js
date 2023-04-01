const Message = require("../model/message");
const status = require("http-status");

exports.store = async (req, res) => {
  try {
    const data = req.body;
    const messageModel = await Message.getModel(req.dbConnetion);
    const newMessage = new messageModel(data);
    await newMessage.save();
    return res.status(status.OK).json(newMessage);
  } catch (error) {
    console.log(error);
    return res
      .status(status.UNPROCESSABLE_ENTITY)
      .json({ error: error.message });
  }
};

exports.get = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messageModel = await Message.getModel(req.dbConnetion);
    const result = await messageModel.find({ conversation: conversationId });
    return res.status(status.OK).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(status.UNPROCESSABLE_ENTITY)
      .json({ error: error.message });
  }
};
