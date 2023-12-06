const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth.js");
const { getChartData } = require("../controllers/chartController.js");

router.get("/:chart/:propertyId", auth, getChartData);

module.exports = router;
