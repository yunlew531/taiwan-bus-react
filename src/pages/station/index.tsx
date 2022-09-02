import React from 'react';
import Breadcrumb from 'components/Breadcrumb';
import styled from '@emotion/styled';
import Search from 'components/Search';
import type { ThemeProps } from 'react-app-env';
import BusList from 'components/BusList';
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

const StationSearchPanel = styled.div<ThemeProps & { show: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.15);
  background: ${({ theme: { colors: { white } } }) => white};
  transition: 0.3s transform linear;
  transform: ${({ show }) => (show ? 'translateX(0)' : 'translateX(-100%)')};
  padding: 20px;
`;

const StationList = styled.ul<ThemeProps & { show: boolean }>`
  display: ${({ show }) => (show ? 'block' : 'none')};
  position: absolute;
  bottom: 0;
  width: 100%;
  max-height: 220px;
  background: ${({ theme: { colors: { white } } }) => white};
  border: 1px solid ${({ theme: { colors: { gray_300 } } }) => gray_300};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  transform: translateY(100%);
  z-index: 1;
  overflow-y: auto;
`;

const SearchGroup = styled.div`
  position: relative;
`;

const StationItem = styled.li<ThemeProps>`
  font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  padding: 15px;
  &:hover {
    background-color: ${({ theme: { colors: { gray_300 } } }) => gray_300};
  }
`;

// TODO: test data
const routes = [
  {
    routeNum: 303,
    route: '台中國際機場 - 台中公園',
  },
  {
    routeNum: 301,
    route: '靜宜大學 - 新民高中',
  },
  {
    routeNum: 304,
    route: '靜宜大學 - 新民高中',
  },
  {
    routeNum: 30851,
    route: '靜宜大學 - 新民高中',
  },

  {
    routeNum: 35,
    route: '靜宜大學 - 新民高中',
  },
  {
    routeNum: 321,
    route: '靜宜大學 - 新民高中',
  },
  {
    routeNum: 3241,
    route: '靜宜大學 - 新民高中',
  },
  {
    routeNum: 32152,
    route: '靜宜大學 - 新民高中',
  },
  {
    routeNum: 3271,
    route: '靜宜大學 - 新民高中',
  },
  {
    routeNum: 322571,
    route: '靜宜大學 - 新民高中',
  },
  {
    routeNum: 56468,
    route: '靜宜大學 - 新民高中',
  },

  {
    routeNum: 65461,
    route: '靜宜大學 - 新民高中',
  },
];

// eslint-disable-next-line arrow-body-style
const Station: React.FC = () => {
  return (
    <>
      <Breadcrumb title="站點查詢" copy timeTable />
      <MainContainer>
        <StationsContainer>
          <StationSearchPanel show>
            <SearchGroup>
              <Search placeholder="請輸入站名" />
              <StationList show={false}>
                {Array.from(Array(10).keys()).map(
                  (item) => <StationItem key={item}>台中車站（成功路口）</StationItem>,
                )}
              </StationList>
            </SearchGroup>
            <BusList routes={routes} height="650" />
          </StationSearchPanel>
          <RoutesOffcanvas show={false} />
        </StationsContainer>
      </MainContainer>
    </>
  );
};

export default Station;
