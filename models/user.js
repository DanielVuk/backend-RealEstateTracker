const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 30,
    minlength: 3,
    required: true,
  },
  email: {
    type: String,
    maxlength: 255,
    minlength: 5,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    maxlength: 1024,
    minlength: 5,
    required: true,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1 week",
  });
};

const User = mongoose.model("User", userSchema);

const validateUser = (user, schemaType = "register") => {
  const schema = Joi.object({
    name:
      schemaType === "register"
        ? Joi.string().max(30).min(3).required()
        : Joi.forbidden(),
    email: Joi.string().max(255).min(5).required().email(),
    password: Joi.string().max(255).min(5).required(),
  });

  return schema.validate(user);
};

module.exports = { User, validateUser };
