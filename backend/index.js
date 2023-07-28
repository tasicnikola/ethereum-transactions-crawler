const app = express();
const express = require("express");
const { Web3 } = require("web3");
const cors = require("cors");
const config = require("./config");
const port = 3000;
app.use(cors());
app.use(express.json());

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    config.projectId
  )
);

app.post("/transactions", async (req, res) => {
  const wallet = req.body.wallet.toLowerCase();
  let block = req.body.block;

  if (block.startsWith("0x")) {
    block = parseInt(block, 16);
  } else {
    block = parseInt(block, 10);
  }

  const transactionsData = await fetchTransactions(wallet, block);

  res.json(transactionsData);
});

async function fetchTransactions(wallet, block) {
  const currentBlock = await web3.eth.getBlockNumber();
  const transactionsData = [];

  for (let blockNum = block; blockNum <= currentBlock; blockNum++) {
    const block = await web3.eth.getBlock(blockNum);
    for (const txHash of block.transactions) {
      const tx = await web3.eth.getTransaction(txHash);
      if (tx.to === wallet || tx.from === wallet) {
        transactionsData.push({
          hash: tx.hash,
          nonce: tx.nonce,
          blockHash: tx.blockHash,
          blockNumber: tx.blockNumber,
          transactionIndex: tx.transactionIndex,
          from: tx.from,
          to: tx.to,
          value: web3.utils.fromWei(tx.value, "ether"),
          gas: tx.gas,
          gasPrice: tx.gasPrice,
          input: tx.input,
        });
      }
    }
  }

  return transactionsData;
}

app.listen(port, () => {
    console.log(`Listening for API Calls`);
    console.log(port);
  });
  