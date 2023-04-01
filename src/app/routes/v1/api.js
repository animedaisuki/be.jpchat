const express = require("express");
const router = new express.Router();
const saasMiddleware = require("../../middleware/SaasMiddleware");
const authMiddleware = require("../../middleware/AuthMiddleware");
const loginController = require("../../controller/LoginController");
const registerController = require("../../controller/RegisterController");
const userController = require("../../controller/UserController");
const conversationController = require("../../controller/ConversationController");

router.use(saasMiddleware.saas);
router.post("/register", registerController.register);
router.post("/login", loginController.index);
router.post("/user/auto-fetch", authMiddleware.auth, userController.autoFetch);
router.get("/user/:userId", userController.getUserById);

router.post("/conversations/add", conversationController.store);
router.get("/conversations/:userId", conversationController.show);

module.exports = router;
