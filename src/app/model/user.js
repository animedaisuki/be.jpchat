const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    default:
      "https://s3.console.aws.amazon.com/s3/object/amahane?region=ap-northeast-1&prefix=users/defaultAvatar/poke.JPG",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

module.exports.getModel = (connection) => {
  if (!connection) {
    throw new Error("No connection");
  }
  return connection.model("users", userSchema);
};
