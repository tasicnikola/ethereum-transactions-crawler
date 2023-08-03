# Ethereum tansaction crawler
# REQUIREMENTS
Requiremets to run application:
-Docker engine
-docker-compose

#INSTRUCTIONS
To run application clone into repository, navigate to etct folder and run
#docker-compose up
command in terminal.
You can use application in your browser on localhost:3000.

#NOTE
-Application runs on Alchemy provider that can recive maximum 330 requests per second, crawling through blocks and transactions can take a lot of resources and there is a lot of data to extract. Application can process ~100 blocks of transactions per minute with usage of full potential of provider api, with room for minor optimization.
-Docker containers are for development purposes, not for deployment!
