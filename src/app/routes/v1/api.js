const express = require("express");
const router = new express.Router();
const saasMiddleware = require("../../middleware/SaasMiddleware");
const authMiddleware = require("../../middleware/AuthMiddleware");
const loginController = require("../../controller/LoginController");
const registerController = require("../../controller/RegisterController");
const userController = require("../../controller/UserController");
const conversationController = require("../../controller/ConversationController");
const messageController = require("../../controller/MessageController");
const chatGptController = require("../../controller/ChatGptController");
const ttsController = require("../../controller/TTSController");

router.use(saasMiddleware.saas);
router.post("/register", registerController.register);
router.post("/login", loginController.index);
router.post("/user/auto-fetch", authMiddleware.auth, userController.autoFetch);
router.get("/user/:userId", userController.getUserById);

router.post(
  "/conversations/add",
  authMiddleware.auth,
  conversationController.store
);
router.get("/conversations/:userId", conversationController.show);

router.post("/messages/send", messageController.store);
router.get("/messages/:conversationId", messageController.get);

router.post("/openai/chat", authMiddleware.auth, chatGptController.stream);
router.get(
  "/openai/chat/fetch/:userId",
  authMiddleware.auth,
  chatGptController.show
);
router.get(
  "/openai/chat/fetch-messages/:conversationId",
  authMiddleware.auth,
  chatGptController.fetchAIMessages
);

router.post("/tts/speak", ttsController.speak);

module.exports = router;
