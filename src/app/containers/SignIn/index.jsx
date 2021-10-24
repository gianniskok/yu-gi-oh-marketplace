import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { Button } from "../../components/button";
import { Marginer } from "../../components/marginer";
import { injected } from "../../components/wallet/connectors";
import { useWeb3React } from "@web3-react/core";
import { NavBar } from "../../components/navbarSignIn";
import { Link } from "react-router-dom";
import { Footer } from "../../components/footer";

const TopSectionContainer = styled.div`
    ${tw`
        min-h-screen
        w-full
        max-w-screen-xl
        flex
        flex-col
        items-center
        bg-black
        justify-between
    `};
`;

const Description = styled.p`
    ${tw`
        flex 
        flex-wrap
        items-center
        max-w-2xl 
        text-sm
        text-white
        md:text-base
        font-normal
        mt-4
    `}
`;

const ButtonsContainer=styled.div`
    ${tw`
        flex   
        mt-4 
        flex-wrap
    `};
`;

const Slogan = styled.h1 `
    ${tw`
        
        text-white
        text-2xl 
        md:text-5xl 
        font-extrabold
        md:font-black
        md:leading-normal  
    `};
`;

export function SignIn(props) {
    
    const {active, account,  activate } = useWeb3React();

    async function connect() {
        try {
            await activate(injected)
            
        } catch(ex) {
            console.log(ex)
        }
    }

    return(
        <TopSectionContainer>
            <NavBar/>
            <Slogan>Welcome to Yu-Gi-Oh Nft MarketPlace!</Slogan>
            <Slogan>Sign In to proceed!</Slogan>
            <Marginer direction="vertical" margin="0.2em"/>
            <Description>
                Connect with your metamask wallet with just a single click!
            </Description>
            {!active ? 
                <ButtonsContainer onClick={() => connect()} > 
                    {<Button text="Sign in with metamask" />}
                </ButtonsContainer> : 
                <Link to="/Home">
                    <ButtonsContainer> 
                        <Button text="Proceed!" />                    
                    </ButtonsContainer>
                </Link>
            }
            { active ? <Description > Connected with {account} </Description>  : <Description> Not connected </Description>} 
            <Footer /> 
        </TopSectionContainer>         
    )
}
