const connectToMongo = require("./db");
const cors = require("cors");
const express = require("express");
connectToMongo();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello helllooooooooooo!");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`iNotebook listening on port ${port}`);
});
