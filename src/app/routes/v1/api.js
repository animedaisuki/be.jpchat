const express = require("express");
const router = new express.Router();
const loginController = require("../../controller/LoginController");
const registerController = require("../../controller/RegisterController");

router.post("/register", registerController.register);
router.post("/login", loginController.index);

module.exports = router;
