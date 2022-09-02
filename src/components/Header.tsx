import React, { useState } from 'react';
import styled from '@emotion/styled';
import type { ThemeProps } from 'react-app-env';
import { Link } from 'react-router-dom';

const Wrap = styled.div<ThemeProps>`
  height: 78px;
  background-color: ${({ theme: { colors: { white } } }) => white};
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
`;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  margin: 0 auto;
  padding: 0 50px;
`;

const IconGroup = styled.div<ThemeProps>`
  cursor: pointer;
  display: flex;
  align-items: center;
  img {
    width: 42px;
    height: 42px;
    margin-right: 13px;
  }
  span {
    display: block;
  }
  .chineseTitle {
    font-size: ${({ theme: { fontSizes: { fs_1 } } }) => fs_1};
    font-weight: 700;
    margin-bottom: 2px;
  }
  .engTitle {
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
    font-weight: 300;
  }
`;

const NavList = styled.nav`
  display: flex;
  justify-content: center;
  flex-grow: 1;
  > a {
    transition: transform 0.1s linear;
    margin-right: 54px;
    &:last-of-type {
      margin-right: 0;
    }
    &:hover {
      transform: scale(1.03);
    }
    &:active {
      transform: scale(0.98);
    }
  }
`;

const LanguageGroup = styled.div`
  display: flex;
  img {
    width: 24px;
    height: 24px;
  }
  button {
    border: none;
    background: none;
    transition: transform 0.1s linear;
    &:hover {
      transform: scale(1.03);
    }
    &:active {
      transform: scale(0.98);
    }
    &.active {
      font-weight: 700;
    }
  }
`;

type Language = 'chinese' | 'english';

const Header: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('chinese');

  return (
    <Wrap>
      <HeaderContainer>
        <Link to="/">
          <IconGroup>
            <img src={`${process.env.PUBLIC_URL}/images/logo-style2.png`} alt="taiwan bus logo" />
            <div>
              <h1>
                <span className="chineseTitle">台灣公車 e 點通</span>
                <span className="engTitle">Taiwan Bus+</span>
              </h1>
            </div>
          </IconGroup>
        </Link>
        <NavList>
          <Link to="/near-station">附近站牌</Link>
          <Link to="/station">站點查詢</Link>
          <Link to="/favorite">我的收藏</Link>
        </NavList>
        <LanguageGroup>
          <img src={`${process.env.PUBLIC_URL}/images/iconoir_language.png`} alt="language icon" />
          <button type="button" className={currentLanguage === 'chinese' ? 'active' : ''}>中文</button>
          <span>/</span>
          <button type="button" className={currentLanguage === 'english' ? 'active' : ''}>英文</button>
        </LanguageGroup>
      </HeaderContainer>
    </Wrap>
  );
};

export default Header;
