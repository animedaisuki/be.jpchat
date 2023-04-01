const status = require("http-status");
const Conversation = require("../model/conversation");
const { Types } = require("mongoose");

exports.store = async (req, res) => {
  try {
    const conversationModel = await Conversation.getModel(req.dbConnetion);
    const userOneId = new Types.ObjectId(req.body.userOne);
    const userTwoId = new Types.ObjectId(req.body.userTwo);
    const newConversation = new conversationModel({
      members: [userOneId, userTwoId],
    });
    await newConversation.save();
    return res.status(status.OK).json(newConversation);
  } catch (error) {
    console.log(error);
    return res
      .status(status.UNPROCESSABLE_ENTITY)
      .json({ error: error.message });
  }
};

exports.show = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  const conversationModel = await Conversation.getModel(req.dbConnetion);
  const result = await conversationModel.find({
    members: { $in: [userId] },
  });
  return res.status(status.OK).json(result);
};
