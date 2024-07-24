import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import DocumentationPage from './components/DocumentationPage';

import logo from "./assets/images/logo.png";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Nunito', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    color: #333;
  }

  a {
    color: #C7672D;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  
  button{
  padding: 10px;
  margin: auto 10px 10px auto;
  border: 1px solid #efdacf;
  

  &:hover{
  cursor: pointer;
  background-color: #D7672D;
  }


  }
`;

const NavLinks = styled.div`
  display: flex;
`;

const Logo = styled.img`
  height: 60px;
  width: auto;
`;

const NavBar = styled.nav`
  background-color: #C7672D;
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLink = styled.a`
  color: white;
  margin-right: 1rem;
  text-decoration: none;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const NavigationBar = ({ currentPath }) => {
  const navigate = useNavigate();

  return (
    <NavBar>
      <NavLinks>
        <NavLink onClick={() => navigate('/home')} active={currentPath === '/home'}>Dashboard</NavLink>
        <NavLink onClick={() => navigate('/documentation')} active={currentPath === '/documentation'}>Documentation</NavLink>
      </NavLinks>
      <Logo src={logo} alt="Logo" />
    </NavBar>
  );
};

const AppContent = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && <NavigationBar currentPath={location.pathname} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Router>
        <AppContent />
      </Router>
   </>
  );
};

export default App;
