const mongoose = require("mongoose");
const Joi = require("joi");

const ownerSchema = new mongoose.Schema(
  {
    name: { type: String },
    share: { type: String },
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    name: { type: String },
    number: { type: String },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ["in progress", "completed"],
    default: "in progress",
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  transactions: [
    {
      type: { type: String, enum: ["income", "expense"], required: true },
      date: { type: Date, default: Date.now },
      description: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
});

const propertySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  type: { type: String, required: true },
  location: {
    city: { type: String, required: true },
    street: { type: String, required: true },
    zip: { type: String, required: true },
  },
  area: { type: Number, min: 0, default: 0, required: true },
  price: { type: Number, min: 0, default: 0, required: true },
  purchaseDate: { type: Date, default: Date.now },
  imageUrls: [{ type: String }],
  owners: [ownerSchema],
  contacts: [contactSchema],
  description: { type: String },
  projects: [projectSchema],
});

const Property = mongoose.model("Property", propertySchema);

const validateProperty = (property) => {
  const schema = Joi.object({
    type: Joi.string().required(),
    location: Joi.object({
      city: Joi.string().required(),
      street: Joi.string().required(),
      zip: Joi.string().required(),
    }),
    area: Joi.number().min(0).required(),
    price: Joi.number().min(0).required(),
    purchaseDate: Joi.date().default(Date.now),
    imageUrls: Joi.array().items(Joi.string()),
    owners: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          share: Joi.number().min(0).max(100).required(),
        })
      )
      .optional(),
    contacts: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          number: Joi.string().required(),
        })
      )
      .optional(),
    description: Joi.string().allow(""),
    projects: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        status: Joi.string()
          .valid("in progress", "completed")
          .default("in progress"),
        createdDate: Joi.date().default(Date.now),
        transactions: Joi.array().items(
          Joi.object({
            type: Joi.string().valid("income", "expense").required(),
            date: Joi.date().default(Date.now),
            description: Joi.string().required(),
            amount: Joi.number().required(),
          })
        ),
      })
    ),
  });

  return schema.validate(property);
};

module.exports = { Property, validateProperty };
