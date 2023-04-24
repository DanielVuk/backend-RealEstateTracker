const bcrypt = require("bcryptjs");
const { User, validateUser } = require("../models/user");

// @desc:   Register new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });

  if (user) return res.status(400).send("User already exists.");

  user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send({
      id: user._id,
      email: user.email,
      password: user.password,
    });
};

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassowrd = await bcrypt.compare(req.body.password, user.password);

  if (!validPassowrd) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();

  res.send(token);
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
};

module.exports = { registerUser, loginUser, getMe };
