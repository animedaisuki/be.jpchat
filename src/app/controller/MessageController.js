const Message = require("../model/message");
const User = require("../model/user");
const status = require("http-status");

exports.store = async (req, res) => {
  try {
    const data = req.body;
    const messageModel = await Message.getModel(req.dbConnetion);
    const newMessage = new messageModel(data);
    await newMessage.save();
    const savedMessage = await messageModel.findById(newMessage.id).populate({
      path: "senderId",
      model: User.getModel(req.dbConnetion),
      select: "-password",
    });
    return res.status(status.OK).json(savedMessage);
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
    const result = await messageModel
      .find({ conversation: conversationId })
      .populate({
        path: "senderId",
        model: User.getModel(req.dbConnetion),
        select: "-password",
      });
    return res.status(status.OK).json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(status.UNPROCESSABLE_ENTITY)
      .json({ error: error.message });
  }
};
