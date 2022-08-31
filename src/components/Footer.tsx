import React from 'react';
import styled from '@emotion/styled';
import type { ThemeProps } from 'react-app-env';

const Wrap = styled.footer<ThemeProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme: { colors: { gray_700 } } }) => gray_700};
  padding: 24px;
  p {
    color: ${({ theme: { colors: { white } } }) => white};
  }
`;

const Footer: React.FC = () => (
  <Wrap>
    <p>Copyright © 2022 台灣公車 e 點通 All rights reserved.</p>
  </Wrap>
);

export default Footer;
