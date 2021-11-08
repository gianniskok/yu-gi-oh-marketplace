# Full stack ethereum blockchain app for Yu-Gi-Oh NFT MarketPlace 

#### v0.1 in progress  :

  - [x] Owner of the contract can create a Yu-Gi-Oh NFT! (ERC721)
  - [x] Users can ReSell in a new Price, Buy or Trade their NFTs 
  - [x] Dynamicly show the unsold Nfts per user
  - [x] Dynamicly show the bought Nfts per user
  - [x] Dynamicly show all availalbe Nfts
  - [x] Dynmamicly show all special NFTs available
  - [x] connect to ipfs for image uploading , storing hash in smartContract and using them on the front end
  - [x] connect to ipfs for uploading image , name. description of NFT 
  - [ ] users can put their NFTs on an auction
  - [x] In order to obtain a Special Card user has to trade up to 3 monsters with value at least equal to the stars of the Special
  - [ ]  More to come



## __Here's how to deploy this project:__

1. Clone the repo
```shel
git clone https://github.com/gianniskok/yu-gi-oh-marketplace.git
```
2. Go to my-app folder
```shel
cd my-app
```
3. Install the dependencies
```shel
sudo npm install 
```
4. Start the local test node
```shel
npx hardhat node
```
5. Deploy the contract
```shel
npx hardhat run scripts/deploy.js --network localhost
```
6. install metamask extention on chrome or firefox.
  - create user.
  - connect to localhost:8545 .
  - import account 0 and 1.
  _(Copy privare keys from harhat node for addresses 0 and 19, click on metamask extension, select import accounts and paste private keys)._
  Click [here](https://metamask.zendesk.com/hc/en-us/articles/360015489331-How-to-import-an-Account) for more info on metamask import accounts

7. Run the app
```shel
npm start
```


#### Feel free to contact me on giannis.kokkoros@hotmail.com for more info
