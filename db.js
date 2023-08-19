const mongoose = require("mongoose");
require("dotenv").config();
const mongoURI = process.env.MONGODB_CONNECTION_STRING;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log(" Mongo connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToMongo;
