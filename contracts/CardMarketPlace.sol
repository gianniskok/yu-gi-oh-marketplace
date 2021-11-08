//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CardMarketPlace is ReentrancyGuard{
    using Counters for Counters.Counter;
    Counters.Counter private _itemsIds;
    Counters.Counter private _itemsSold;

    address payable owner;
    uint256 listingPrice = 0.025 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    enum CardType {Monster, Spell, Trap, Special}
    
    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        uint256 stars;
        CardType cardType;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold,
        uint256 stars,
        CardType cardType
    );

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function setListingPrice(uint256 _listingPrice) private {
        listingPrice = _listingPrice ;
    }

    function createMarketItem(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price,
        uint256 _stars,
        CardType _cardType
    ) public payable nonReentrant {
        require(_price > 0, "Price must be higher than 0 wei");
        require(msg.value == listingPrice,"Price must be equal to llisting price");
        require(msg.sender == owner, "Only owner can mint new Nft's");   
        _itemsIds.increment();
        uint256 itemId = _itemsIds.current();
        idToMarketItem[itemId] = MarketItem(
            itemId,
            _nftContract,
            _tokenId,
            payable(msg.sender),
            payable(address(0)),
            _price,
            false,
            _stars,
            _cardType
        );
           
        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);
        emit MarketItemCreated(
           itemId,
           _nftContract,
           _tokenId,
           msg.sender,
           address(0),
           _price,
           false,
           _stars,
           _cardType
       );
    }
    function reSellMarketItem(
        address _nftContract,
        uint256 _itemId,
        uint256 _price) 
    public payable nonReentrant{
        require(_price > 0, "At least 1 wei");
        require(msg.value == listingPrice,"Price must be equal to llisting price");
        require(msg.sender == idToMarketItem[_itemId].owner, "Not the owner");
        uint _tokenId = idToMarketItem[_itemId].tokenId;
        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);
        idToMarketItem[_itemId].price = _price;
        idToMarketItem[_itemId].owner = payable(address(0));
        idToMarketItem[_itemId].seller = payable(msg.sender);
        idToMarketItem[_itemId].sold = false;
        idToMarketItem[_itemId].cardType = CardType.Monster;
        _itemsSold.decrement();   
    }

    function tradeForSpecial(
        address _nftContract,
        uint256[] memory _tokenIdSell,
        uint256 _tokenIdBuy
    ) public payable nonReentrant {
        uint256 totalStars;
        for(uint i =0; i < _tokenIdSell.length;i++){
            totalStars += idToMarketItem[_tokenIdSell[i]].stars;
            require(msg.sender == idToMarketItem[_tokenIdSell[i]].owner, "Not the owner");
            require(idToMarketItem[_tokenIdSell[i]].cardType == CardType.Monster, "Not Monster");
        }
        require(totalStars >= idToMarketItem[_tokenIdBuy].stars, "Not enough stars");
        for(uint i =0; i < _tokenIdSell.length;i++){
            uint256 tokenId = idToMarketItem[_tokenIdSell[i]].tokenId;
            IERC721(_nftContract).transferFrom(msg.sender, address(this), tokenId);
            _itemsSold.decrement();
            idToMarketItem[_tokenIdSell[i]].owner = payable(address(0));
            idToMarketItem[_tokenIdSell[i]].seller = payable(owner);
             idToMarketItem[_tokenIdSell[i]].sold = false;            
        }
        IERC721(_nftContract).transferFrom(address(this), msg.sender, _tokenIdBuy);
        idToMarketItem[_tokenIdBuy].owner = payable(msg.sender);
        idToMarketItem[_tokenIdBuy].seller = payable(address(0));
        idToMarketItem[_tokenIdBuy].sold = true;
        _itemsSold.increment();
    }

    function createMarketSale(
        address _nftContract,
        uint256 _itemId
    ) public payable nonReentrant {
        uint price = idToMarketItem[_itemId].price;
        uint tokenId = idToMarketItem[_itemId].tokenId;
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");
        require(idToMarketItem[_itemId].cardType != CardType.Special, "You can't buy specials");
        idToMarketItem[_itemId].seller.transfer(msg.value);
        IERC721(_nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[_itemId].owner = payable(msg.sender);
        idToMarketItem[_itemId].seller = payable(address(0));
        idToMarketItem[_itemId].sold = true;
        _itemsSold.increment();
        payable(owner).transfer(listingPrice);
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemsIds.current();
        uint unsoldItemCount = itemCount - _itemsSold.current();
        uint currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for(uint i =0; i<itemCount; i++){
            if(idToMarketItem[i+1].owner == address(0)) {
                uint currentId = i+1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }
        return items;
    }  

    function fetchSpecials() public view returns (MarketItem[] memory) {
        uint itemCount = _itemsIds.current();
        uint currentIndex = 0;
        uint specials = 0;
        for(uint i =0; i<itemCount; i++){
            if(idToMarketItem[i+1].cardType == CardType.Special  ){
                specials +=1 ;
            }
        }
        MarketItem[] memory items = new MarketItem[](specials);
        for(uint i =0; i<itemCount; i++){
            if(idToMarketItem[i+1].cardType == CardType.Special) {
                uint currentId = i+1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }
        return items;
    }  

    function fetchMyNfts() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemsIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i =0; i<totalItemCount; i++){
            if(idToMarketItem[i+1].owner == msg.sender){
                itemCount +=1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint i =0; i<totalItemCount; i++){
            if(idToMarketItem[i+1].owner == msg.sender) {
                uint currentId = i+1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }
        return items;
    }   

    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemsIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        for(uint i =0; i<totalItemCount; i++){
            if(idToMarketItem[i+1].seller == msg.sender){
                itemCount +=1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint i =0; i<totalItemCount; i++){
            if(idToMarketItem[i+1].seller == msg.sender) {
                uint currentId = i+1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }
        return items;
    }  

    function getCardPrice(uint256 _cardId) public view returns (uint) {
        uint256 price = idToMarketItem[_cardId].price;
        return price;
    }

    function getCardType(uint256 _cardId) public view returns (CardType) {
        CardType cardType = idToMarketItem[_cardId].cardType;
        return cardType;
    }

    function contractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function contractOwner() public view returns (address){
        return owner;
    }
}