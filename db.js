const mongoose = require("mongoose");

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log(" Mongo connected");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

module.exports = connectToMongo;
