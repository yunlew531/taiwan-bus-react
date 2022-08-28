import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { theme } from 'styleSheets/theme';
import type { Theme } from 'styleSheets/theme';
import styled from '@emotion/styled';

const H1 = styled.h1<{ theme?: Theme }>`
  font-size: ${({ theme: { fontSizes: { fs_1 } } }) => fs_1};
  color: ${({ theme: { colors: { primary } } }) => primary};
`;

const App = () => (
  <ThemeProvider theme={theme}>
    <div className="App">
      <header className="App-header">
        <H1>this is h1</H1>
        <p>
          Edit
          {' '}
          <code>src/App.tsx</code>
          {' '}
          and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  </ThemeProvider>
);

export default App;
