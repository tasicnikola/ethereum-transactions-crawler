# Ethereum Transaction Crawler

## Requirements
Before running the application, ensure you have the following installed:
- Docker engine

## Example: 
If a user requests to view transactions associated with the address 0xaa7a9ca87d3694b5755f213b5d04094b8d0f0a6f from block 9000000 to the current block, application should crawl and visualize all transaction data (addresses that have sent and received tokens from the address 0xaa7a9ca87d3694b5755f213b5d04094b8d0f0a6f, and how much ETH was used for a given transaction) in that period of time.
Given a date in YYYY-MM-DD format, the program should return the exact value of ETH that was available on the given address at YYYY-MM-DD 00:00 UTC time.

## Instructions
To run the application, follow these steps:
1. Clone this repository to your local machine.
2. Navigate to the cloned repository.
3. Run the following command in the terminal:
`docker-compose up`
4. Once the containers are up and running, you can access the application in your web browser at `localhost:3000`.

## Note
- The application uses the Alchemy provider, which has a maximum rate limit of 330 CUPS. Crawling through blocks and transactions can be resource-intensive, and there is a considerable amount of data to extract. As a result, the application can process approximately 100 blocks of transactions per minute at the full potential of the provider API, with some room for minor optimization.
- The Docker containers provided are intended for development purposes only and not suitable for production deployment.
