const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { registerUser } = require("../controllers/userController.js");

router.post("/", registerUser);

module.exports = router;
