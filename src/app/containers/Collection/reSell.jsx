import React from "react";
import styled from "styled-components";
import { Marginer } from "../../components/marginer";
import tw from "twin.macro";
import { useState } from 'react';
import { ethers} from 'ethers';
import { Button } from "../../components/button";
import CardMarketPlace from "../../../artifacts/contracts/CardMarketPlace.sol/CardMarketPlace.json";


const createMarketPlaceAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; 
const nftAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

const CardCreatorContainer = styled.div`
    width: 100%;
    ${tw`
        w-full
        max-w-screen-xl
        flex
        flex-col
        justify-between
        lg:pl-12 
        lg:pr-12
        pl-3
        pr-3
        pt-10
        items-center
    `};
`;

const StepDescription = styled.p`
    ${tw`
        text-base
        md:text-base
        text-center
        w-10/12 
        text-gray-200
    `};
`;

const Title = styled.h2`
    ${tw`
        text-5xl
        lg:text-4xl 
        text-white
        font-extrabold
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

const Form = styled.form`
  ${tw`
    w-full
    flex
    flex-col
    items-center
  `};
`;

const Input = styled.input.attrs(props => ({
    type: "number",
  }))`
    border: 2px solid black;
    width: 370px;
    height: 40px;
    ${tw`
        text-2xl 
    `};
`;

export function ReSell(props) {
    async function requestAccount() {
        await window.ethereum.request({ method : 'eth_requestAccounts' });
    }

    const [price, setPrice] = useState('');
    const [id, setId] = useState('');

    async function reSell(){
        if(price === '' || id === ''){
            console.log("Put valid price and Id")
            return
        }
        if(typeof window.ethereum !== 'undefined') {
            await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            let contract = new ethers.Contract(createMarketPlaceAddress, CardMarketPlace.abi, signer)
            let listingPrice = await contract.getListingPrice()
            listingPrice = listingPrice.toString()
            const valueEthers = ethers.utils.parseUnits(price, 'ether')
            const tx = await contract.reSellMarketItem(nftAddress, id, valueEthers, {value: listingPrice})
            await tx.wait()
        }
    }

    return(
        <CardCreatorContainer>
            <Title> Re-Sell your NFT's </Title>
            <Marginer direction="vertical" margin = "1em"/>        
            <Form>
                <StepDescription>
                    Declare the Id of the card you want to Re-sell!
                </StepDescription>
                <Input size="0.2em" onChange={e => setId(e.target.value)} placeholder="Id of NFT" />
                <Marginer direction="vertical" margin="1em" />
                <StepDescription>
                    Declare the price of the card in ETH!
                </StepDescription>
                <Input size="0.2em" onChange={e => setPrice(e.target.value)} placeholder="Price of NFT" />
            </Form>  
            <Marginer direction="vertical" margin="1em" />
            <ButtonsContainer onClick={reSell}>
                <Button text="Re-Sell Nft" />
            </ButtonsContainer>
        </CardCreatorContainer>
    );    
}