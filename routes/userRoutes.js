const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/userController.js");
const { auth } = require("../middleware/auth.js");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", auth, getMe);

module.exports = router;
