const connectToMongo = require("./db");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

connectToMongo();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: "35mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "35mb" }));
app.use(express.json({ limit: "10mb" })); // Increase the limit as needed
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Increase the limit as needed

app.get("/", (req, res) => {
  res.send("Hello helllooooooooooo!");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/files", require("./routes/files"));

app.listen(port, () => {
  console.log(`iNotebook listening on port ${port}`);
});
