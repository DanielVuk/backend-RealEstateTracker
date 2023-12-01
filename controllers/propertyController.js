const { Property, validateProperty } = require("../models/property");
const { User } = require("../models/user");

// @desc:   Get user properties
// @route   GET /api/properties
// @access  Private
const getProperties = async (req, res) => {
  const properties = await Property.find({ user: req.user._id });

  res.status(200).json(properties);
};

// @desc:   Get property by ID
// @route   GET /api/properties/:id
// @access  Private
const getPropertyById = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) return res.status(404).json({ error: "Property not found" });

  if (property.user.toString() !== req.user._id) {
    return res
      .status(403)
      .json({ error: "Unauthorized: You don't own this property" });
  }
  res.status(200).json(property);
};

// @desc:   Get user paginated properties
// @route   GET /api/properties/paginated-properties
// @access  Private
const getPropertiesWithPagination = async (req, res) => {
  const { page, itemsPerPage, type, minPrice, maxPrice, minArea, maxArea } =
    req.query;

  const filter = { user: req.user._id };

  if (type) filter.type = type;

  if (minPrice) filter.price = { $gte: parseInt(minPrice) };

  if (maxPrice) filter.price = { ...filter.price, $lte: parseInt(maxPrice) };

  if (minArea) filter.area = { $gte: parseInt(minArea) };

  if (maxArea) filter.area = { ...filter.area, $lte: parseInt(maxArea) };

  const startIndex = (page - 1) * itemsPerPage;
  const filteredAndPaginatedProperties = await Property.find(filter)
    .skip(startIndex)
    .limit(itemsPerPage);

  const totalFilteredProperties = await Property.countDocuments(filter);

  res.status(200).json({
    properties: filteredAndPaginatedProperties,
    totalProperties: totalFilteredProperties,
  });
};

// @desc:   Create a new property
// @route   POST /api/properties
// @access  Public
const createProperty = async (req, res) => {
  const { error } = validateProperty(req.body);

  if (error) {
    console.log(error);
    return res.status(400).send(error.details[0].message);
  }

  const newProperty = new Property({ ...req.body, user: req.user._id });

  const createdProperty = await newProperty.save();

  if (!createdProperty)
    return res.status(400).json({ error: "Failed to create property" });

  res.status(200).json(createdProperty);
};

// @desc:   Delete property
// @route   DELETE /api/properties/:id
// @access  Private
const deleteProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) return res.status(404).json({ error: "Property not found." });

  const user = await User.findById(req.user._id);

  if (!user) return res.status(403).json({ error: "User not found." });

  if (property.user.toString() !== req.user._id)
    return res.status(403).json({ error: "User not authorized." });

  await property.deleteOne();

  res.status(200).json({ _id: req.params.id });
};

// @desc:   Update property
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  if (!id || Object.keys(updateFields).length === 0) {
    return res.status(400).json({
      error: "Invalid request. Property ID and update fields are required.",
    });
  }

  const updatedProperty = await Property.findByIdAndUpdate(id, updateFields, {
    new: true,
  });

  if (!updatedProperty)
    return res.status(404).json({ message: "Property not found" });

  res.status(200).json(updatedProperty);
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  deleteProperty,
  updateProperty,
  getPropertiesWithPagination,
};
