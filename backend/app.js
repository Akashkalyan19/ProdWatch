const express = require("express");
const cors = require("cors");
const app = express();
const authRouter = require("./src/routes/auth.routes");
const orgRouter = require("./src/routes/org.routes");
const incidentRouter = require("./src/routes/incident.routes");

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/org", orgRouter);
app.use("/incidents", incidentRouter);

app.get("/health", (req, res) => {
  res.send("Server running");
});

module.exports = app;
