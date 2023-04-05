const mongoose = require("mongoose");
const { Types } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
    friends: [{ type: Types.ObjectId, ref: "users" }],
    conversations: [{ type: Types.ObjectId, ref: "conversations" }],
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports.getModel = (connection) => {
  if (!connection) {
    throw new Error("No connection");
  }
  return connection.model("users", userSchema);
};
