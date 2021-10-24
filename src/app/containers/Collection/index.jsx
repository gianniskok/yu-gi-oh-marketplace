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
    height: 770px;
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
    height: 10em;
    
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
    `};

`;

const BottomContainer = styled.div `
    ${tw`
        
        w-full
        flex
        flex-col
        items-center
        justify-between
        pt-6

    `};

`;

const Title2 = styled.h2 `
    font-size: 20px;
    font-weight: 500;
    ${tw`
        text-black
        text-base
        font-extrabold
    `};
`;

const Title4 = styled.p `
    font-size: 20px;
    font-weight: 500;
    ${tw`
        text-black
        flex
        text-xs
    `};
`;

const Title3 = styled.h2 `
    font-size: 20px;
    font-weight: 500;
    ${tw`
        text-red-900
        text-lg
        font-extrabold
    `};
`;

const SpecialistName = styled.h4 `

    ${tw`
        text-black
        text-base
        items-center
    `};
    font-size: 20px;


`;

const PriceContainer = styled.div `
    ${tw`
        flex
        items-center
    `};
`;

const PriceText = styled.div `
    ${tw`
    `};
    color: rgba(255, 0, 0, 1);
    font-weight: 500;
`;

const StartingAtText = styled.h6 `
    color: rgba(0, 1, 100, 0.5);
    font-weight: 400;
`;

const ButtonsContainer=styled.div`
    width: 200px;
    ${tw`
        flex    
        flex-wrap
        h-full
    `};
`;

// const FooterContainer = styled.div `
//     height:100%;
//     ${tw`
//         flex
//         items-center  
//         pl-20 
//     `};
    
// `;



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
                    sold: i.sold.toString()
                }
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
                            <Title3> ID: {card.tokenId.toString()}</Title3>
                            <Title2>{card.name}</Title2>
                            <Marginer direction='vertical' margin="0.2em" />
                            <Title4>{card.description}</Title4>
                            <Marginer direction='vertical' margin="0.4em" />
                            {card.owner === "0x0000000000000000000000000000000000000000" ? <Title2>SELLER: {card.seller}</Title2> : ""}
                            {card.owner !== "0x0000000000000000000000000000000000000000" ? <Title2>OWNER: {card.owner}</Title2> : ""}
                        </ContentContainer>
                        <BottomContainer>
                            <PriceContainer>
                                <StartingAtText>Price:  </StartingAtText>
                                <Marginer direction='horizontal' margin="0.2em" />
                                <PriceText>{card.price.toString()} ETH </PriceText>
                                <Marginer direction='horizontal' margin="0.5em" />
                            </PriceContainer>
                            <Marginer direction='vertical' margin="0.4em" />
                            <PriceContainer>
                                <SpecialistName> 
                                    Status : {card.sold.toString() === 'false' ? "Available" : "Sold"}
                                </SpecialistName>
                            </PriceContainer>
                        </BottomContainer>
                    </CardContainer>
                        ))
                        }              
                </ServicesWrapper>            
            </ServicesContainer>
            <Footer />
        </PageContainer>
    )
}