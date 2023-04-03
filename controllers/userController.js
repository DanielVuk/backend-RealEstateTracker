const bcrypt = require("bcryptjs");
const { User, validateUser } = require("../models/user");

// @desc:  Register new user
// @route  POST /api/users
const registerUser = async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });

  if (user) return res.status(400).send("User already exosts.");

  user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  res.send({
    id: user._id,
    email: user.email,
    password: user.password,
  });
};

module.exports = { registerUser };
