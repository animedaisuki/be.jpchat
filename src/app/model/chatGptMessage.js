const mongoose = require("mongoose");
const { Types } = require("mongoose");

const chatGptMessageSchema = new mongoose.Schema(
  {
    senderId: { type: Types.ObjectId, ref: "users" },
    conversation: { type: Types.ObjectId, ref: "chatGptConversations" },
    text: { type: String },
  },
  { timestamps: true }
);

exports.getModel = async (connection) => {
  if (!connection) {
    throw new Error("No connection");
  }
  return connection.model("chatGptMessages", chatGptMessageSchema);
};
