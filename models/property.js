const { default: mongoose, SchemaType } = require("mongoose");

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
  purchaseDate: { type: String, required: true },
  imageUrls: [{ type: String }],
  owners: [ownerSchema],
  contacts: [contactSchema],
  description: { type: String },
});
const Property = mongoose.model("Property", propertySchema);

module.exports = { Property };
