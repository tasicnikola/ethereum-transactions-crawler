const express = require("express");
const NodeCache = require("node-cache");
const { findBlockByTimestamp, getEthBalance } = require("./utils");

const app = express();
const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

app.post("/eth-balance", async (req, res) => {
  try {
    const wallet = req.body.wallet.toLowerCase();
    const date = req.body.date;
    const cacheKey = `eth-balance:${wallet}:${date}`;

    const cachedBalance = cache.get(cacheKey);
    if (undefined !== cachedBalance) {
      return res.json({ balance: cachedBalance });
    }

    const timestamp = Math.floor(new Date(date).getTime() / 1000);
    const blockNumber = await findBlockByTimestamp(timestamp);

    if (null === blockNumber) {
      return res
        .status(404)
        .json({ error: "No data available for the specific date" });
    }

    const balance = await getEthBalance(wallet, blockNumber);

    cache.set(cacheKey, balance);

    res.json({ balance });
  } catch (error) {
    console.error("Error fetching ETH balance:", error);
    res.status(500).json({ error: "Failed to fetch ETH balance" });
  }
});

module.exports = app;
