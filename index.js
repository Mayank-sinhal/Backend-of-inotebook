const connectToMongo = require("./db");
const cors = require("cors");
const express = require("express");

connectToMongo();

const app = express();
const port = process.env.PORT;

app.use(cors());
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
