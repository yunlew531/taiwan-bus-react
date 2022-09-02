import React from 'react';
import styled from '@emotion/styled';
import type { PropsWithChildren } from 'react';
import type { ThemeProps } from 'react-app-env';

const Wrap = styled.div<ThemeProps & { show: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: auto;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.15);
  background: ${({ theme: { colors: { white } } }) => white};
  transition: 0.3s transform linear;
  transform: ${({ show }) => (show ? 'translateX(0)' : 'translateX(-100%)')};
  padding: 20px;
`;

interface IOffcanvas {
  show: boolean;
}

// eslint-disable-next-line arrow-body-style
const Offcanvas: React.FC<PropsWithChildren & IOffcanvas> = ({ children, show }) => {
  return (
    <Wrap show={show}>
      {children}
    </Wrap>
  );
};

export default Offcanvas;
