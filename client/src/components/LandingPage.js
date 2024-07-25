import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LandingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:center;
  height: 50%;
  width: 90%;
  margin: auto;
  margin-top: 128px;
  background-color: #f0e6e1;
  position: relative;
  
`;

const WelcomeText = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
 
`;

const EnterButton = styled.button`
  background-color: #C7672D;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
  border: 1px solid black;

  &:hover {
    background-color: #A55420;
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <LandingContainer>
      <WelcomeText>Welcome to My Assessment Showcase Page</WelcomeText>
      <EnterButton onClick={() => navigate('/home')}>Step In</EnterButton>
    </LandingContainer>
  );
};

export default LandingPage;
