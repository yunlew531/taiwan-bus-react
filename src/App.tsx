import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import theme from 'styleSheets/theme';
import routes from './routes';

const App = () => {
  const element = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      {element}
    </ThemeProvider>
  );
};

const AppWrapper: React.FC = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
