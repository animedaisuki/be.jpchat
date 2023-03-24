const express = require("express");
const router = new express.Router();
const saasMiddleware = require("../../middleware/SaasMiddleware");
const loginController = require("../../controller/LoginController");
const registerController = require("../../controller/RegisterController");

router.use(saasMiddleware.saas);
router.post("/register", registerController.register);
router.post("/login", loginController.index);

module.exports = router;
