const mongoose = require("mongoose");
const { Types } = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: Types.ObjectId, ref: "users" },
    conversation: { type: Types.ObjectId, ref: "conversations" },
    text: { type: String },
  },
  { timestamps: true }
);

exports.getModel = async (connection) => {
  if (!connection) {
    throw new Error("No connection");
  }
  return connection.model("messages", messageSchema);
};
