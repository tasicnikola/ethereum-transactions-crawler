const express = require("express");
const app = express();
const cors = require("cors");
const config = require("../config/config");
const ethBalance = require("./ethBalance");
const transactions = require("./transactions");
app.use(cors());
app.use(express.json());

const PORT = config.port;

app.use(ethBalance);
app.use(transactions);

app.listen(PORT, () => {
  console.log(`Listening for API Calls on port ${PORT}`);
});
