require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const error = require("./middleware/error.js");

app.use(express.json());
app.use(cors());

app.use("/api/users", require("./routes/userRoutes.js"));
app.use("/api/properties", require("./routes/propertyRoutes.js"));

app.use(error);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => {
    console.log(error.message);
  });
