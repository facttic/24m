import React from 'react';
import styled, { withTheme } from 'styled-components';
import Constants from '../constants'
import Image from './Image'

const Wrapper = styled.aside`
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // self-align: center;
  text-align: center;
`;

const CounterIcon = styled(Image)`
  display: inline-block;
  height: auto;
  height: 16.5px;
  width: 18px;
  margin: 0 8px;
  // border-radius: 50%;
  position: relative;
  //top: 6px;
  @media (max-width: ${props => props.theme.pageWidth.m}px) {
    margin: 0 3px;
  }
`;

const Text = styled.p`
  font-size: 0.95rem;
  align-self: center;
  margin-bottom: 0;

  @media (max-width: ${props => props.theme.pageWidth.m}px) {
    font-size: 0.975rem;
  }
`;

// const Count = styled.div`
//   display: flex;
//   flex-direction: columns;
//   align-items: center;
// `;

const Count = styled.span`
  // display: inline-block;
  // color: white;
  // background-color: #243243;
  // font-family: 'Roboto',sans-serif;
  // border-radius: 10%;
  // padding: 5px;
  // margin-right: 15px;
  // margin-left: 15px;
  font-weight: 700;
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #e47f2c;
  background-image: ${props => props.theme.colors.gradientRainbowText};
  background-size: 100%;
`;

const UsersCounter = (props) => {
    const { minUsersCount } = Constants
    const areEnoughUsers = props.count >= minUsersCount;

    function renderCounter() {
        return (
          <Wrapper>
              <Text>
                <CounterIcon 
                  imgSrc={props.countImgSrc}
                  imgAlt={props.countImgAlt}
                  imgHeight={props.countImgHeight}
                  imgWidth={props.countImgWidth}
                />
                Somos más de <Count>{(Math.floor(props.count/100)*100).toLocaleString("es")}</Count> personas marchando
                <CounterIcon 
                  imgSrc={props.countImgSrc}
                  imgAlt={props.countImgAlt}
                  imgHeight={props.countImgHeight}
                  imgWidth={props.countImgWidth}
                />
              </Text>
          </Wrapper> 
        )
    }

    return (
        <div>
            { areEnoughUsers &&
                renderCounter()
            }   
        </div>
    ); 
}

export default withTheme(React.memo(UsersCounter));