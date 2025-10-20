const mongoose = require("mongoose");
const { Types } = require("mongoose");
const UserModel = require("../app/model/user");
const config = require("../app/config/app");
const bcrypt = require("bcrypt");

const AI_USER_DATA = {
  email: "ai@jpchat.com",
  username: "ChatGPT",
  password: "ai_secure_password_2024",
};

const initAIUser = async (connection) => {
  try {
    const AI_USER_ID = config.aiUserId;
    const User = UserModel.getModel(connection);

    const existingUser = await User.findOne({
      $or: [{ email: AI_USER_DATA.email }, { username: AI_USER_DATA.username }],
    });

    if (existingUser) {
      console.log("AI User already exists:", existingUser._id);
      return existingUser._id.toString();
    }

    console.log("Creating AI User...");
    const hashedPassword = await bcrypt.hash(AI_USER_DATA.password, 8);

    const aiUser = new User({
      _id: new Types.ObjectId(AI_USER_ID),
      email: AI_USER_DATA.email,
      username: AI_USER_DATA.username,
      password: hashedPassword,
      isActive: true,
    });
    await aiUser.save();
    console.log("✅ AI User created successfully:", AI_USER_ID);
    return AI_USER_ID;
  } catch (e) {
    console.error("Error initializing AI user:", e);
    throw e;
  }
};

module.exports = async function () {
  const connection = await mongoose
    .connect(config.db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((e) => {
      console.log(e);
      process.exit(1);
    });

  try {
    await initAIUser(connection.connection);
  } catch (error) {
    console.error("Failed to initialize AI user:", error);
  }

  return connection.connection.db;
};
