require("dotenv").config();
const app = require("./app");
const pool = require("./src/db/pool");
const PORT = process.env.PORT || 3000;

pool.on("connect", () => {
  console.log("PostgreSQL connected");
});

app.listen(PORT, () => {
  console.log(`Server is listening at port : ${PORT}`);
});
