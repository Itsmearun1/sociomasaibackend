const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors());
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const connection = async () => {
  try {
    await mongoose.connect(process.env.mongo_url);
    console.log("connected to mongo");
    app.listen(8080, () => {
      console.log("Running on port 8080");
    });
  } catch (err) {
    console.log(err);
  }
};
connection();
app.use("/user", userRoutes);
app.use("/post", postRoutes);

