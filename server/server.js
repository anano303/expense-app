require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRouter = require("./api/app");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
