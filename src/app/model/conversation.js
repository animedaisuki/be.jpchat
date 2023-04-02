const mongoose = require("mongoose");
const { Types } = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: [{ type: Types.ObjectId, ref: "users" }],
  },
  { timestamps: true }
);

module.exports.getModel = async (connection) => {
  if (!connection) {
    throw new Error("No connection");
  }
  return connection.model("conversations", conversationSchema);
};
