import React from 'react';
import styled from '@emotion/styled';
import Breadcrumb from 'components/Breadcrumb';
import type { ThemeProps } from 'react-app-env';

const MainContainer = styled.div<ThemeProps>`
  position: absolute;
  top: 36px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  background-color: ${({ theme: { colors: { white } } }) => white};
  `;

const FavoriteContainer = styled.div<ThemeProps>`
  max-width: 742px;
  width: 100%;
  margin-top: 36px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  border-radius: 0px 0px 5px 5px;
  margin-bottom: 36px;
`;

const FavoriteBtnGroup = styled.div<ThemeProps>`
  margin-bottom: 20px;
  button {
    width: 50%;
    border: none;
    border-radius: 5px 5px 0px 0px;
    padding: 14px;
  }
`;

const FavoriteBusStopBtn = styled.button<ThemeProps>`
  font-weight: 700;
  color: ${({ theme: { colors: { white } } }) => white};
  background-color: ${({ theme: { colors: { primary } } }) => primary};
`;

const FavoriteBusStationBtn = styled.button<ThemeProps>`
  color: ${({ theme: { colors: { black } } }) => black};
  background-color: ${({ theme: { colors: { gray_200 } } }) => gray_200};
`;

const CitySelector = styled.div<ThemeProps>`
  max-width: 335px;
  position: relative;
  margin: 0 auto 20px;
`;

const Selected = styled.div<ThemeProps>`
  position: relative;
  background-color: ${({ theme: { colors: { gray_300 } } }) => gray_300};
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 9px 14px;
  .title {
    cursor: default;
  }
  .expand-more {
    position: absolute;
    right: 10px;
    top: 6px;
    cursor: default;
  }
`;

const CityList = styled.ul<{ show: boolean }>`
  display: ${({ show }) => (show ? 'block' : 'none')};
  position: absolute;
  bottom: -3px;
  width: 100%;
  max-height: 220px;
  overflow-y: auto;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  transform: translateY(100%);
`;

const CityItem = styled.li<ThemeProps>`
  font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  background-color: ${({ theme: { colors: { white } } }) => white};
  transition: background-color 0.1s linear;
  padding: 12px 15px;
  &:hover {
    background-color: ${({ theme: { colors: { gray_300 } } }) => gray_300};
  }
`;

const BusStopList = styled.ul<{ show:boolean }>`
  display: ${({ show }) => (show ? 'block' : 'none')};
  max-height: 530px;
  overflow-y: auto;
  margin: 0 35px;
`;

const BusStopItem = styled.li<ThemeProps>`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme: { colors: { gray_400 } } }) => gray_400};
  padding: 12px 5px;
  .bus-number {
    font-size: ${({ theme: { fontSizes: { fs_1 } } }) => fs_1};
    font-weight: 700;
    margin-bottom: 5px;
  }
  .content {
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
    color: ${({ theme: { colors: { gray_600 } } }) => gray_600};
  }
`;

const FavoriteGroup = styled.div<ThemeProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  .favorite {
    font-size: ${({ theme: { fontSizes: { fs_2 } } }) => fs_2};
    margin-bottom: 5px;
  }
  .title {
    color: ${({ theme: { colors: { gray_600 } } }) => gray_600};
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  }
`;

const BusStationList = styled.ul<{ show: boolean }>`
  display: ${({ show }) => (show ? 'block' : 'none')};
  max-height: 530px;
  overflow-y: auto;
  margin: 0 35px;
`;

const BusStationItem = styled.li<ThemeProps>`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme: { colors: { gray_400 } } }) => gray_400};
  padding: 12px 5px;
  .bus-number {
    display: inline-block;
    font-weight: 700;
    margin-right: 7px;
  }
  .bus-description {
    color: ${({ theme: { colors: { gray_600 } } }) => gray_600};
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  }
  .bus-station {
    font-size: ${({ theme: { fontSizes: { fs_2 } } }) => fs_2};
    font-weight: 700;
    margin-top: 5px;
  }
`;

// eslint-disable-next-line arrow-body-style
const Favorite: React.FC = () => {
  return (
    <>
      <Breadcrumb title="我的收藏" />
      <MainContainer>
        <FavoriteContainer>
          <FavoriteBtnGroup>
            <FavoriteBusStopBtn type="button">收藏站牌</FavoriteBusStopBtn>
            <FavoriteBusStationBtn type="button">收藏站點</FavoriteBusStationBtn>
          </FavoriteBtnGroup>
          <CitySelector>
            <Selected>
              <p className="title">台北市</p>
              <span className="material-icons-outlined expand-more">expand_more</span>
            </Selected>
            <CityList show={false}>
              <CityItem>台北市</CityItem>
              <CityItem>台北市</CityItem>
              <CityItem>台北市</CityItem>
            </CityList>
          </CitySelector>
          <BusStopList show={false}>
            <BusStopItem>
              <div>
                <p className="bus-number">30 延</p>
                <p className="content">台中區監理所 - 台中火車站</p>
              </div>
              <FavoriteGroup>
                <span className="material-icons-outlined favorite">favorite</span>
                <p className="title">台中</p>
              </FavoriteGroup>
            </BusStopItem>
          </BusStopList>
          <BusStationList show>
            <BusStationItem>
              <div>
                <span className="bus-number">300</span>
                <span className="bus-description">往台中車站</span>
                <p className="bus-station">科博館（專用道）</p>
              </div>
              <FavoriteGroup>
                <span className="material-icons-outlined favorite">favorite</span>
                <p className="title">台中</p>
              </FavoriteGroup>
            </BusStationItem>
          </BusStationList>
        </FavoriteContainer>
      </MainContainer>
    </>
  );
};

export default Favorite;
