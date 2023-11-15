const { raw } = require("express");
const { Property } = require("../models/property");
const { User } = require("../models/user");

// @desc:   Get user properties
// @route   GET /api/properties
// @access  Private
const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({ user: req.user._id });

    res.status(200).json(properties);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

// @desc:   Get property by ID
// @route   GET /api/properties/:id
// @access  Private
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (property.user.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You don't own this property" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

// @desc:   Create a new property
// @route   POST /api/properties
// @access  Public
const createProperty = async (req, res) => {
  try {
    const newProperty = new Property({ ...req.body, user: req.user._id });

    const createdProperty = await newProperty.save();

    if (!createdProperty) {
      return res.status(500).json({ error: "Failed to create property" });
    }

    res.status(201).json(createdProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc:   Delete property
// @route   DELETE /api/properties/:id
// @access  Private
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(400);
      throw new Error("Property not found.");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(401);
      throw new Error("User not found.");
    }

    if (property.user.toString() !== req.user._id) {
      res.status(401);
      throw new Error("User not authorized.");
    }

    await property.deleteOne();

    res.status(200).json({ _id: req.params.id });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed with deletion.");
  }
};

// @desc:   Update property
// @route   PUT /api/properties/:id
// @access  Private
const updatePropery = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    console.log("PROPERTY: ", property);
    if (!property) {
      res.status(400);
      throw new Error("Property not found.");
    }
    const user = await User.findById(req.user._id);
    console.log("TU SAM 1");
    if (!user) {
      res.status(401);
      throw new Error("User not found.");
    }

    if (property.user.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You don't own this property" });
    }
    // const updatedProperty = await Property.findByIdAndUpdate(
    //   req.params.id,
    //   req.body,
    //   { new: true }
    // );
    // res.status(200).json(updatedProperty);
    res.status(200).send("Updatan property");
    console.log("TU SAM 4");
  } catch (error) {
    res.status(500).send("Something failed with updating.");
  }
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  deleteProperty,
  updatePropery,
};