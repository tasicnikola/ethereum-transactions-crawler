const express = require("express");
const NodeCache = require("node-cache");
const { fetchTransactions } = require("./utils");

const app = express();
const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

app.post("/transactions", async (req, res) => {
  try {
    const wallet = req.body.wallet.toLowerCase();
    let block = req.body.block;

    const cacheKey = `transactions:${wallet}:${block}`;
    const cachedTransactions = cache.get(cacheKey);

    if (undefined !== cachedTransactions) {
      return res.json(cachedTransactions);
    }

    if (block.startsWith("0x")) {
      block = BigInt(block);
    } else {
      block = BigInt(parseInt(block, 10));
    }

    const transactionsData = await fetchTransactions(wallet, block);

    cache.set(cacheKey, transactionsData);

    res.json(transactionsData);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

module.exports = app;
