import React, { useEffect } from 'react';
import { BrowserRouter, useRoutes, HashRouter } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import theme from 'styleSheets/theme';
import styled from '@emotion/styled';
import Header from 'components/Header';
import Footer from 'components/Footer';
import getAuthorizationHeader from 'utils/getAuthorizationHeader';
import Cookies from 'js-cookie';
import routes from './routes';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContainer = styled.div`
  position: relative;
  flex-grow: 1;
`;

const App = () => {
  const element = useRoutes(routes);

  useEffect(() => {
    getAuthorizationHeader().then(({ access_token }) => {
      Cookies.set('taiwanBus', access_token, { expires: 1 });
    }).catch((err) => {
      console.error(err);
    });
  }, []);

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

const browserElement = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

const hashElement = (
  <HashRouter>
    <App />
  </HashRouter>
);

const AppWrapper: React.FC = () => (process.env.NODE_ENV === 'production' ? hashElement : browserElement);

export default AppWrapper;
