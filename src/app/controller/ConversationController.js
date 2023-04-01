const status = require("http-status");
const Conversation = require("../model/conversation");
const User = require("../model/user");
const { Types } = require("mongoose");

exports.store = async (req, res) => {
  try {
    const conversationModel = await Conversation.getModel(req.dbConnetion);
    const userOneId = req.body.userOne;
    const userTwoId = req.body.userTwo;
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
  const conversationModel = await Conversation.getModel(req.dbConnetion);
  const result = await conversationModel
    .find({
      members: { $in: [userId] },
    })
    .populate({
      path: "members",
      model: User.getModel(req.dbConnetion),
      select: "-password",
    });
  return res.status(status.OK).json(result);
};
