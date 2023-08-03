# Ethereum Transaction Crawler

## Requirements
Before running the application, ensure you have the following installed:
- Docker engine
- docker-compose

## Instructions
To run the application, follow these steps:
1. Clone this repository to your local machine.
2. Navigate to the `etct` folder in the cloned repository.
3. Run the following command in the terminal:
`docker-compose up`
4. Once the containers are up and running, you can access the application in your web browser at `localhost:3000`.

## Note
- The application uses the Alchemy provider, which has a maximum rate limit of 330 requests per second. Crawling through blocks and transactions can be resource-intensive, and there is a considerable amount of data to extract. As a result, the application can process approximately 100 blocks of transactions per minute at the full potential of the provider API, with some room for minor optimization.
- The Docker containers provided are intended for development purposes only and not suitable for production deployment.
