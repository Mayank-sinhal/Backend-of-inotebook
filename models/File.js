const mongoose = require("mongoose");
const { Schema } = mongoose;
const FileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  originalname: {
    type: String,
  },
  filename: {
    type: String,
  },
});

module.exports = mongoose.model("file", FileSchema);
