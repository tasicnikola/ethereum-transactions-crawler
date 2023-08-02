const path = require("path");
const dotenvPath = path.join(__dirname, "..", ".env");
require("dotenv").config({ path: dotenvPath });

module.exports = {
  projectId: process.env.ALCHEMY_PROVIDER,
  chunkSize: process.env.CHUNK_SIZE,
  requsetDelay: process.env.REQUEST_DELAY_MS,
  port: process.env.PORT,
  maxRequestsPerSecond: process.env.MAX_REQUESTS_PER_SECOND
};
