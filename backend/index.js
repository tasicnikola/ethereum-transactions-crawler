const express = require("express");
const { Web3 } = require("web3");
const app = express();
const cors = require("cors");
const config = require("./config");

const port = 3000;
app.use(cors());
app.use(express.json());

const web3 = new Web3(new Web3.providers.HttpProvider(config.projectId));
const CHUNK_SIZE = 200;
const REQUEST_DELAY_MS = 100;

app.post("/transactions", async (req, res) => {
  try {
    const wallet = req.body.wallet.toLowerCase();
    let block = req.body.block;

    if (block.startsWith("0x")) {
      block = BigInt(block);
    } else {
      block = BigInt(parseInt(block, 10));
    }

    const transactionsData = await fetchTransactions(wallet, block);
    res.json(transactionsData);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

async function fetchTransactions(wallet, block) {
  const currentBlock = BigInt(await web3.eth.getBlockNumber());
  const transactionsData = [];
  const totalChunks =
    (currentBlock - block + BigInt(1)) / BigInt(CHUNK_SIZE) + BigInt(1);

  for (let chunk = BigInt(0); chunk < totalChunks; chunk++) {
    const fromBlock = block + chunk * BigInt(CHUNK_SIZE);
    const toBlock =
      currentBlock < fromBlock + BigInt(CHUNK_SIZE - 1)
        ? currentBlock
        : fromBlock + BigInt(CHUNK_SIZE - 1);

    const blockRangePromises = [];
    for (let blockNum = fromBlock; blockNum <= toBlock; blockNum++) {
      blockRangePromises.push(
        fetchWithDelay(() => web3.eth.getBlock(blockNum, true))
      );
    }

    const blocks = await Promise.all(blockRangePromises);
    for (const blockData of blocks) {
      for (const tx of blockData.transactions) {
        if (tx.to === wallet || tx.from === wallet) {
          transactionsData.push({
            hash: tx.hash,
            nonce: parseInt(tx.nonce.toString()),
            blockHash: tx.blockHash,
            blockNumber: parseInt(tx.blockNumber.toString()),
            transactionIndex: parseInt(tx.transactionIndex.toString()),
            from: tx.from,
            to: tx.to,
            value: web3.utils.fromWei(tx.value, "ether"),
            gas: parseInt(tx.gas.toString()),
            gasPrice: parseInt(tx.gasPrice.toString()),
            input: tx.input,
          });
        }
      }
    }
  }

  return transactionsData;
}

function fetchWithDelay(apiCall) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const result = await apiCall();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, REQUEST_DELAY_MS);
  });
}

app.listen(port, () => {
  console.log(`Listening for API Calls`);
  console.log(port);
});
