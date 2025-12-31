const express = require("express");
const cors = require("cors");
const app = express();
const authRouter = require("./src/routes/auth.routes");
app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);

app.get("/health", (req, res) => {
  res.send("Server running");
});

module.exports = app;
