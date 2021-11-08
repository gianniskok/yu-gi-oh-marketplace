import React from "react";
import styled from "styled-components";
import tw from "twin.macro";

const AboutUsContainer = styled.div`
${tw`
    w-full
    flex
    items-center
    max-w-screen-xl
    xl:justify-center
    pt-4 
    pr-7 
    pl-7 
    md:pl-0 
    md:pr-0 
    
`};
`;

const InfoContainer = styled.div`
    ${tw`
        
        w-full
        flex
        items-center
        justify-between
        flex-col
        pl-16
    `};
`;

const Title = styled.h1`
    ${tw`
        
        text-white
        text-2xl 
        md:text-5xl 
        font-extrabold
        md:font-black
        md:leading-normal      
    `};
`;

const InfoText = styled.p`
    ${tw`
        
        max-w-2xl 
        text-sm
        text-gray-200
        md:text-base
        font-normal
        mt-4
    `};
`;

export function AboutPage(props) {
    return (
    <AboutUsContainer>
        <InfoContainer>
            <Title>See the NFT's you own!</Title>
            <InfoText>
               See them , flex them, sell them! 
            </InfoText>
        </InfoContainer>
    </AboutUsContainer>
    );
}