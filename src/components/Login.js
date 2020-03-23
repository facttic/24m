import React from 'react';
import styled, { withTheme } from 'styled-components';
import CardImage from './CardImage';
import CardInfo from './CardInfo';
import CardModeration from './CardModeration';

const Wrapper = styled.div`
  width: 300px;
  max-width: calc(100% - 30px);
  background-color: #fff;
  position: absolute;
  z-index: 2;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 4px 8px -2px rgba(0,0,0,.45); 
  top: 20px;
  left: 0;
  right: 0;
  margin: 0 auto 20px auto;
  padding: 1em 15px;
`;

const Title = styled.h2`
  font-size: 1em;
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 1.5em;
`;

const Label = styled.label`
  font-size: 0.75em;
  display:block;
  margin-bottom: 0.25em;
`;

const Input = styled.input`
  display:block;
  font-size: 1.25em;
  background-color: #eee;
  border: 0;
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
  width: 100%;
  padding: 0.5em 10px;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  border: 0;
  padding: 1em 10px;
  margin-bottom: 1em;

  background-color: #2a2;
  color: #fff;
  cursor: pointer;

  :hover {
    background-color: #080;
  }
`;

const Login = (props) => {

  return (
    <Wrapper className="Login" onMouseLeave={props.close}>
      <Title>Ingreso de moderadorxs</Title>
      <Label for="user">Usuario</Label>
      <Input type="text" />
      <Label for="password">Contraseña</Label>
      <Input type="text" />
      <Button>Ingresar</Button>
    </Wrapper>
  );
}

export default withTheme(React.memo(Login));