import React from "react";
import styled from "styled-components";
import { useEffect } from "react";
import { useState } from "react";
import { Marginer } from "../../components/marginer";
import tw from "twin.macro";
import { ethers} from 'ethers';
import CardMarketPlace from "../../../artifacts/contracts/CardMarketPlace.sol/CardMarketPlace.json";
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json";
import axios from "axios";
import { NavBarHomePage } from "../../components/navbarHomepage";
import { Footer } from "../../components/footer";
import { AboutPage } from "./aboutPage";
import { Button } from "../../components/button";
import { Link } from "react-router-dom";
import { ReSell } from "./reSell";

const createMarketPlaceAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; 
const nftAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

const PageContainer = styled.div `
    min-height:970px;
    ${tw`
        bg-black
        flex
        flex-col
        w-full
        h-full
        items-center
        overflow-x-hidden
    `}
`;

const ServicesContainer = styled.div `
    ${tw`
        w-full
        flex
        flex-col
        items-center
        text-red-700
        font-extrabold
        text-4xl
    `};
`;

const Title = styled.h1 `
    ${tw`
        text-red-700
        font-extrabold
        text-4xl
    `};
`;

const ServicesWrapper = styled.div`
    ${tw`
        flex
        flex-wrap
    `}


`;

const CardContainer = styled.div `
    ${tw`
        flex
        flex-col
        overflow-hidden
        mt-0.5 
        mb-5
        mr-2
        ml-9
    `};
    width: 440px;
    height: 740px;
    background-color: #fff;
    box-shadow: 0 0 3.9px rgba(0, 0 ,0, 0.27);
    border-bottom: 3px solid rgba(255, 0, 0, 1);
    border-top: 3px solid rgba(255, 0, 0, 1);
    border-left: 3px solid rgba(255, 0, 0, 1);
    border-right: 3px solid rgba(255, 0, 0, 1);
`;

const TopContainer = styled.div `    
    ${tw`
        w-full
    `};
`;

const ServiceThumbnail = styled.div `
    width: 100%;
    height: 14em;
    
    img {
        width: 100%;
        height: 100%;
    }
`;

const ContentContainer = styled.div `
    ${tw`
        w-full
        flex
        flex-col
        items-center
        justify-between
        pr-4
        pl-4
        pt-1
        bg-black
    `};

`;

const BottomContainer = styled.div `
    ${tw`
        bg-black
        w-full
        flex
        flex-col
        items-center
        justify-between

    `};

`;

const TitleContainer = styled.div `
    ${tw`
        flex
        flex-row
        w-full
        items-center
        justify-between
        pr-24
        pl-24
    `};
`;

const Title2 = styled.h2 `
    font-size: 20px;
    font-weight: 500;
    ${tw`
        text-white
        text-base
        font-extrabold
    `};
`;

const Title3 = styled.h2 `
    font-size: 20px;
    font-weight: 500;
    ${tw`
        text-red-900
        text-xl
        font-extrabold
    `};
`;

const SpecialistName = styled.h4 `

    ${tw`
        text-white
        text-base
        items-center
    `};
    font-size: 20px;


`;

const PriceContainer = styled.div `
    ${tw`
        flex
        flex-col
        items-center
    `};
`;

const ButtonsContainer=styled.div`
    width: 200px;
    ${tw`
        flex    
        flex-wrap
        h-full
    `};
`;



export function Collection(props) {
    const [cards, setCards] = useState([]);
    const [mapping, setMapping] = useState('not')
    useEffect(() => {
        loadCards()
    }, [])

    async function loadCards() {
        if(typeof window.ethereum !== 'undefined' ){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const marketcontract = new ethers.Contract(createMarketPlaceAddress, CardMarketPlace.abi, signer);
            const tokencontract = new ethers.Contract(nftAddress, NFT.abi, provider)
            const data = await marketcontract.fetchMyNfts();

            const cardsL = await Promise.all(data.map(async i => {
                const tokenUri = await tokencontract.tokenURI(i.tokenId)
                const meta = await axios.get(tokenUri)
                let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
                let cardL = {
                    price,
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.data.image,
                    name: meta.data.name,
                    description: meta.data.description,
                    sold: i.sold.toString(),
                    totalSupply: meta.data.totalSupply,
                    type: i.cardType
                }
                if(cardL.type === 0){
                    cardL.type = 'Monster'
                }else if (cardL.type === 1){
                    cardL.type = 'Spell'
                }else if(cardL.type === 2){
                    cardL.type = 'Trap'
                }else {cardL.type = 'Special'}
                return cardL;
                
            }))
            console.log(cardsL.length)
            if(cardsL.length > 0) { setMapping('yes')}
            setCards(cardsL)

        }
    }

    if ( mapping === 'not') { return (
        <PageContainer>
            <NavBarHomePage/>
            <Marginer direction='vertical' margin="2em" />
            <AboutPage/>
            <Marginer direction='vertical' margin="2em" />
            <ServicesContainer>You don't own any NFT's Buy Some?</ServicesContainer>
            <Marginer direction='vertical' margin="2em" />
            <Link to="/Home">
                    <ButtonsContainer> 
                        <Button text="Home Page" />                    
                    </ButtonsContainer>
                </Link>
            <Footer />
        </PageContainer>
    )}
   console.log(cards)
    return(
       <PageContainer>
            <NavBarHomePage />
            <Marginer direction='vertical' margin="2em" />
            <AboutPage/>
            <ServicesContainer>
                <Title>Available cards</Title>
                <Marginer direction="vertical" margin="3em"/>                           
                <ServicesWrapper > {cards.map((card, i) => (           
                    <CardContainer key={i} >
                    <TopContainer >
                        <ServiceThumbnail >
                            <img src={card.image} alt=" " />
                        </ServiceThumbnail>
                    </TopContainer>
                    <ContentContainer>
                        <TitleContainer>
                            <Title3> ID: {card.tokenId.toString()} </Title3>
                            <Title3>TYPE: {card.type}</Title3> 
                        </TitleContainer>
                        <Title2>{card.name}</Title2>
                        <Marginer direction="vertical" margin="0.3em"/>
                        {card.seller !== "0x0000000000000000000000000000000000000000" ? <Title2>SELLER: {card.seller}</Title2> : ""}
                        {card.owner !== "0x0000000000000000000000000000000000000000" ? <Title2>OWNER: {card.owner}</Title2> : ""}
                    </ContentContainer>
                    <BottomContainer>
                        <Marginer direction="vertical" margin="0.3em"/>
                        <PriceContainer>
                            <Title3>Price: {card.price.toString()} ETH </Title3>
                        </PriceContainer>
                        <Marginer direction="vertical" margin="0.5em"/>
                        <PriceContainer>
                            <SpecialistName> 
                                Status : {card.sold.toString() === 'false' ? "Available" : "Sold"}
                            </SpecialistName>
                            <Marginer direction="vertical" margin="0.3em"/>
                            <SpecialistName> 
                                Total Supply : {card.totalSupply}
                            </SpecialistName>
                        </PriceContainer>
                    </BottomContainer>
                </CardContainer>
                        ))
                        }            
                </ServicesWrapper>            
            </ServicesContainer>
            <ReSell />
            <Footer />
        </PageContainer>
    )
}