const express = require("express");
const { Web3 } = require("web3");
const app = express();
const cors = require("cors");
const config = require("../config/config");
const NodeCache = require("node-cache");
app.use(cors());
app.use(express.json());

const CHUNK_SIZE = config.chunkSize;
const REQUEST_DELAY_MS = config.requsetDelay;
const PORT = config.port;
const MAX_REQUESTS_PER_SECOND = config.maxRequestsPerSecond;

const web3 = new Web3(new Web3.providers.HttpProvider(config.projectId));
const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 });
let requestQueue = [];
let requestInProgress = false;

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

async function findBlockByTimestamp(timestamp) {
  const currentBlock = BigInt(await web3.eth.getBlockNumber());
  let left = 0n;
  let right = currentBlock;

  while (left <= right) {
    const mid = (left + right) / 2n;

    const blockNum = BigInt(mid.toString());
    const blockData = await fetchBlockData(blockNum);

    if (!blockData) {
      return null;
    }

    if (blockData.timestamp < timestamp) {
      left = blockNum + 1n;
    } else {
      right = blockNum - 1n;
    }
  }

  return right;
}

async function fetchBlockData(blockNum) {
  try {
    const blockData = await web3.eth.getBlock(blockNum, true);
    return blockData;
  } catch (error) {
    console.error("Error fetching block data:", error);
    return null;
  }
}

async function getEthBalance(wallet, blockNumber) {
  const balance = await fetchWithDelay(() =>
    web3.eth.getBalance(wallet, blockNumber)
  );

  return web3.utils.fromWei(balance, "ether");
}

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

async function fetchTransactions(wallet, block) {
  const currentBlock = BigInt(await web3.eth.getBlockNumber());
  const transactionsData = [];
  const totalChunks =
    (currentBlock - block + BigInt(1)) / BigInt(CHUNK_SIZE) + BigInt(1);

  const chunkPromises = [];

  for (let chunk = BigInt(0); chunk < totalChunks; chunk++) {
    const fromBlock = block + chunk * BigInt(CHUNK_SIZE);
    const toBlock =
      currentBlock < fromBlock + BigInt(CHUNK_SIZE - 1)
        ? currentBlock
        : fromBlock + BigInt(CHUNK_SIZE - 1);

    const blockRangePromises = [];
    for (let blockNum = fromBlock; blockNum <= toBlock; blockNum++) {
      blockRangePromises.push(
        throttleRequest(() => web3.eth.getBlock(blockNum, true))
      );
    }

    chunkPromises.push(Promise.all(blockRangePromises));
  }

  const chunksData = await Promise.all(chunkPromises);
  const blocks = chunksData.flat();

  for (const blockData of blocks) {
    if (!blockData) {
      continue;
    }
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

function throttleRequest(apiCall) {
  return new Promise((resolve, reject) => {
    const makeRequest = async () => {
      if (requestInProgress || requestQueue.length >= MAX_REQUESTS_PER_SECOND) {
        setTimeout(makeRequest, 1000 / MAX_REQUESTS_PER_SECOND);
      } else {
        requestInProgress = true;
        try {
          const result = await apiCall();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          requestInProgress = false;
          if (requestQueue.length > 0) {
            const nextRequest = requestQueue.shift();
            nextRequest();
          }
        }
      }
    };

    requestQueue.push(makeRequest);

    if (!requestInProgress) {
      const nextRequest = requestQueue.shift();
      nextRequest();
    }
  });
}

app.listen(PORT, () => {
  console.log(`Listening for API Calls`);
  console.log(PORT);
});
