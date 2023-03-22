const express = require("express");
const router = new express.Router();
const loginController = require("../../controller/LoginController");

console.log("router");
router.post("/login", loginController.index);

module.exports = router;
