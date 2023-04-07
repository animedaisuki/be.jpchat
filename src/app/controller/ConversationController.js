const status = require("http-status");
const Conversation = require("../model/conversation");
const User = require("../model/user");
const errorHandler = require("../helper/errorHandler");

exports.store = async (req, res) => {
  try {
    const conversationModel = await Conversation.getModel(req.dbConnetion);
    const requestUserId = req.userId;
    const receiverUsername = req.body.receiverUsername;

    const userModel = User.getModel(req.dbConnetion);

    const requestUser = await userModel.findById(requestUserId);

    //check if receiver exists
    const receiverUser = await userModel.findOne({
      username: receiverUsername,
    });
    if (!receiverUser) {
      return res
        .status(status.NOT_FOUND)
        .json({ error: errorHandler.USER_NOT_FOUND });
    }
    const receiverUserId = receiverUser.id;

    //check if the receiver is the user himself
    if (receiverUserId === requestUserId) {
      return res
        .status(status.FORBIDDEN)
        .json({ error: errorHandler.ILLEGAL_FRIEND_REQUEST });
    }

    //check if the receiver is AI (hard code)
    if (receiverUserId === "642f6590587a99d158680216") {
      return res
        .status(status.FORBIDDEN)
        .json({ error: errorHandler.ILLEGAL_FRIEND_REQUEST });
    }

    //check if a requester already has this friend
    const checkFriendExist = await userModel
      .find({ _id: requestUserId, friends: { $in: [receiverUserId] } })
      .populate({ path: "friends", model: userModel });
    if (checkFriendExist.length > 0) {
      return res
        .status(status.FORBIDDEN)
        .json({ error: errorHandler.FRIEND_DUPLICATION });
    }

    //储存会话
    const newConversation = new conversationModel({
      members: [requestUserId, receiverUserId],
    });
    await newConversation.save();

    //在user schema中储存friend和conversation信息
    requestUser.friends.push(receiverUserId);
    requestUser.conversations.push(newConversation.id);
    await requestUser.save();
    receiverUser.friends.push(requestUserId);
    receiverUser.conversations.push(newConversation.id);
    await receiverUser.save();

    const populatedNewConversation = await conversationModel
      .findById(newConversation.id)
      .populate({
        path: "members",
        model: userModel,
        select: "-password",
      });

    return res
      .status(status.OK)
      .json({ populatedNewConversation, receiverId: receiverUserId });
  } catch (error) {
    console.log(error);
    return res
      .status(status.UNPROCESSABLE_ENTITY)
      .json({ error: error.message });
  }
};

exports.show = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    //temporarily send empty objects to frontend
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
};
