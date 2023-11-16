const express = require("express");
const router = express.Router();
const {
  createProperty,
  getProperties,
  deleteProperty,
  updateProperty,
  getPropertyById,
} = require("../controllers/propertyController.js");

const { auth } = require("../middleware/auth.js");

router.route("/").post(auth, createProperty).get(auth, getProperties);

router
  .route("/:id")
  .delete(auth, deleteProperty)
  .put(auth, updateProperty)
  .get(auth, getPropertyById);

module.exports = router;
