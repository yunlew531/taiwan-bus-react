import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import theme from 'styleSheets/theme';
import styled from '@emotion/styled';
import Header from 'components/Header';
import Footer from 'components/Footer';
import routes from './routes';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContainer = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const App = () => {
  const element = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <Wrap>
        <Header />
        <MainContainer>
          {element}
        </MainContainer>
        <Footer />
      </Wrap>
    </ThemeProvider>
  );
};

const AppWrapper: React.FC = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
