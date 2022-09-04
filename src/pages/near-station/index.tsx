import React from 'react';
import styled from '@emotion/styled';
import type { ThemeProps } from 'react-app-env';
import Breadcrumb from 'components/Breadcrumb';
import Search from 'components/Search';
import Offcanvas from 'components/Offcanvas';
import TimeBadge from 'components/TimeBadge';
import RoutesOffcanvas from 'components/RoutesOffcanvas';

const MainContainer = styled.div`
  position: absolute;
  top: 36px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: stretch;
  border: 1px red dashed;
`;

const StationsContainer = styled.div`
  position: relative;
  max-width: 464px;
  width: 100%;
`;

const StationList = styled.ul`
  margin-top: 36px;
  height: 600px;
  overflow-y: auto;
`;

const StationItem = styled.li<ThemeProps>`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme: { colors: { gray_400 } } }) => gray_400};
  padding: 12px 0;
  margin: 0 12px;
  &:hover {
    filter: brightness(0.7);
  }
  .title {
    font-size: ${({ theme: { fontSizes: { fs_2 } } }) => fs_2};
    font-weight: 700;
    margin-bottom: 3px;
  }
  .description{
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
    color: ${({ theme: { colors: { gray_600 } } }) => gray_600};
  }
`;

const DistanceContainer = styled.div<ThemeProps>`
  display: flex;
  align-items: center;
  color: ${({ theme: { colors: { gray_600 } } }) => gray_600};
  .location {
    font-size: ${({ theme: { fontSizes: { fs_1 } } }) => fs_1};
    margin-right: 3px;
  }
  .distance {
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  }
`;

const RoutesContainer = styled.div`
  padding: 0 20px;
  margin-top: 30px;
`;

const BackToSearchBtn = styled.button<ThemeProps>`
  display: flex;
  align-items: center;
  font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  border: none;
  background-color: transparent;
  transition: 0.1s transform linear;
  .material-icons-outlined {
    font-size: ${({ theme: { fontSizes: { fs_1 } } }) => fs_1};
    margin-right: 5px;
  }
  &:hover {
    transform: scale(1.03);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const StationNameContainer = styled.div<ThemeProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  .title {
    font-size: ${({ theme: { fontSizes: { fs_2 } } }) => fs_2};
  }
`;

const SortTimeBtn = styled.button<ThemeProps>`
  display: flex;
  align-items: center;
  border: none;
  background-color: transparent;
  transition: transform 0.1s linear;
    &:hover {
      transform: scale(1.03);
    }
    &:active {
      transform: scale(0.98);
    }
  .list-icon {
    font-size: ${({ theme: { fontSizes: { fs_3 } } }) => fs_3};
    margin-right: 6px;
  }
  .content {
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  }
`;

const RouteList = styled.ul`
  
`;

const RouteItem = styled.li<ThemeProps>`
  display: flex;
  justify-content: start;
  align-items: center;
  border-bottom: 1px solid ${({ theme: { colors: { gray_400 } } }) => gray_400};
  transition: filter 0.1s linear;
  padding:12px;
  &:hover {
    filter: brightness(0.7);
  }
`;

const RouteContent = styled.div<ThemeProps>`
  margin-right: auto;
  .route-num {
    font-size: ${({ theme: { fontSizes: { fs_1 } } }) => fs_1};
    margin-bottom: 3px;
  }
  .route-directoin {
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
    color: ${({ theme: { colors: { gray_600 } } }) => gray_600};
  }
`;

const FavoriteBtn = styled.button<ThemeProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  background-color: transparent;
  transition: transform 0.1s linear;
  &:hover {
    transform: scale(1.03);
  }
  &:active {
    transform: scale(0.98);
  }
  .city {
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
    color: ${({ theme: { colors: { gray_600 } } }) => gray_600};
  }
  .favorite {
    font-size: ${({ theme: { fontSizes: { fs_1 } } }) => fs_1};
  }
`;

const NearStation: React.FC = () => {
  return (
    <>
      <Breadcrumb title="附近站牌" copy timeTable />
      <MainContainer>
        <StationsContainer>
          <Offcanvas show>
            <Search placeholder="想去哪裡？" />
            <StationList>
              {
                Array.from(Array(15).keys()).map((item) => (
                  <StationItem key={item}>
                    <div>
                      <h2 className="title">台中國家歌劇院</h2>
                      <span className="description">3 個站牌</span>
                    </div>
                    <DistanceContainer>
                      <span className="material-icons-outlined location">location_on</span>
                      <span className="distance">210 m</span>
                    </DistanceContainer>
                  </StationItem>
                ))
              }
            </StationList>
          </Offcanvas>
          <Offcanvas show>
            <BackToSearchBtn type="button">
              <span className="material-icons-outlined">chevron_left</span>
              <p>返回搜尋</p>
            </BackToSearchBtn>
            <RoutesContainer>
              <StationNameContainer>
                <h2 className="title">台中國家歌劇院</h2>
                <SortTimeBtn>
                  <span className="material-icons-outlined list-icon">list</span>
                  <span className="content">依到站時間排序</span>
                </SortTimeBtn>
              </StationNameContainer>
              <RouteList>
                {/* // TODO: map routes */}
                <RouteItem>
                  <TimeBadge status="過站">過站</TimeBadge>
                  <RouteContent>
                    <p className="route-num">161</p>
                    <p className="route-directoin">往 中科管理局</p>
                  </RouteContent>
                  <FavoriteBtn type="button">
                    <span className="material-icons-outlined favorite">favorite_border</span>
                    {/* <span className="material-icons-outlined favorite">favorite</span> */}
                    <p className="city">台中</p>
                  </FavoriteBtn>
                </RouteItem>
                <RouteItem>
                  <TimeBadge status="即將進站">即將進站</TimeBadge>
                  <RouteContent>
                    <p className="route-num">161</p>
                    <p className="route-directoin">往 中科管理局</p>
                  </RouteContent>
                  <FavoriteBtn type="button">
                    <span className="material-icons-outlined favorite">favorite_border</span>
                    {/* <span className="material-icons-outlined favorite">favorite</span> */}
                    <p className="city">台中</p>
                  </FavoriteBtn>
                </RouteItem>
                <RouteItem>
                  <TimeBadge status="10分">10: 10</TimeBadge>
                  <RouteContent>
                    <p className="route-num">161</p>
                    <p className="route-directoin">往 中科管理局</p>
                  </RouteContent>
                  <FavoriteBtn type="button">
                    <span className="material-icons-outlined favorite">favorite_border</span>
                    {/* <span className="material-icons-outlined favorite">favorite</span> */}
                    <p className="city">台中</p>
                  </FavoriteBtn>
                </RouteItem>
              </RouteList>
            </RoutesContainer>
          </Offcanvas>
          <RoutesOffcanvas show />
        </StationsContainer>
      </MainContainer>
    </>
  );
};

export default NearStation;
