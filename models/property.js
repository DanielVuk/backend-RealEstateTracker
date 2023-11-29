const mongoose = require("mongoose");

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

module.exports = { Property };
