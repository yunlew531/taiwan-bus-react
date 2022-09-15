import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from 'components/Breadcrumb';
import styled from '@emotion/styled';
import Search from 'components/Search';
import type { ICityCounty, IStation, ThemeProps } from 'react-app-env';
import BusList from 'components/BusList';
import RoutesOffcanvas from 'components/RoutesOffcanvas';
import { useLazyGetStationsQuery } from 'services/bus';

const MainContainer = styled.div`
  position: absolute;
  top: 36px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: stretch;
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

const CityListGroup = styled.div`
  position: relative;
  margin-bottom: 10px;
  `;

const CityListSelectedBtn = styled.button<ThemeProps>`
  position: relative;
  width: 100%;
  height: 36px;
  line-height: 36px;
  text-align: left;
  border: none;
  background-color: ${({ theme: { colors: { gray_100 } } }) => gray_100};
  border-radius: 10px;
  padding: 0 15px;
  .material-icons-outlined.expend-more {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  &:hover {
    filter: brightness(0.95);
  }
`;

const CityList = styled.ul<ThemeProps & { show:boolean }>`
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  opacity: ${({ show }) => (show ? '1' : '0')};
  transition: 0.1s visibility, 0.1s opacity linear;
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

const CityListItem = styled.li<ThemeProps>`
  padding: 10px;
  &:hover {
    background-color: ${({ theme: { colors: { gray_300 } } }) => gray_300};
  }
`;

const StationListContainer = styled.div<ThemeProps & { show: boolean }>`
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  opacity: ${({ show }) => (show ? '1' : '0')};
  transition: 0.1s visibility, 0.1s opacity linear;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  transform: translateX(calc(100% + 10px));
  &::after {
    content: '';
    position: absolute;
    top: 15px;
    left: 0;
    background-color: #fff;
    box-shadow: -1px 2px rgba(0, 0, 0, 0.1);
    width: 15px;
    height: 15px;
    transform: rotate(45deg) translateX(-50%);
    z-index: 10;
  }
`;

const StationList = styled.ul<ThemeProps>`
  min-width: 200px;
  max-height: 500px;
  background: ${({ theme: { colors: { white } } }) => white};
  border: 1px solid ${({ theme: { colors: { gray_300 } } }) => gray_300};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  overflow: auto;
  padding: 10px;
`;

const NoMatchStations = styled.div<ThemeProps>`
  background: ${({ theme: { colors: { white } } }) => white};
  background: ${({ theme: { colors: { white } } }) => white};
  border: 1px solid ${({ theme: { colors: { gray_300 } } }) => gray_300};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  padding: 10px;
`;

const SearchGroup = styled.div`
  position: relative;
`;

const StationItem = styled.li<ThemeProps>`
  font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  padding: 8px 15px;
  &:hover {
    background-color: ${({ theme: { colors: { gray_300 } } }) => gray_300};
  }
  p {
    cursor: default;
  }
`;

const StationItemTitle = styled.p`
  margin-bottom: 5px;
`;

const StationItemAddress = styled.p<ThemeProps>`
  color: ${({ theme: { colors: { gray_600 } } }) => gray_600};
  font-size: ${({ theme: { fontSizes: { fs_5 } } }) => fs_5};
`;

const Station: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [busDirection, setBusDirection] = useState<0 | 1>(0);
  const [cityCounty, setCityCounty] = useState<Array<ICityCounty>>([]);
  const [citySelected, setCitySelected] = useState('臺北市');
  const [isCityListShow, setIsCityListShow] = useState(false);
  const [isStationListShow, setIsStationListShow] = useState(false);
  const [getStationsTrigger, { data: stations }] = useLazyGetStationsQuery();
  const [currentStation, setCurrentStation] = useState<IStation>();

  const fetchCityCounty = () => {
    fetch(`${process.env.PUBLIC_URL}/json/CityCountyData.json`)
      .then((res) => res.json() as Promise<Array<ICityCounty>>)
      .then((cityData) => { setCityCounty(cityData); })
      .catch(() => {});
  };

  const computeStationsMatchSearch = useMemo(
    () => stations
      ?.filter((station) => station.StationName.Zh_tw.match(searchValue))
      .filter((item, idx) => idx < 300),
    [stations, searchValue],
  );

  useEffect(() => {
    fetchCityCounty();
    getStationsTrigger({ city: 'NewTaipei' }).catch(() => {});
  }, []);

  return (
    <>
      <Breadcrumb title="站點查詢" copy timeTable />
      <MainContainer>
        <StationsContainer>
          <StationSearchPanel show>
            <CityListGroup>
              <CityListSelectedBtn onClick={() => { setIsCityListShow(!isCityListShow); }}>
                <p>{citySelected}</p>
                <span className="material-icons-outlined expend-more">expand_more</span>
              </CityListSelectedBtn>
              <CityList show={isCityListShow}>
                {
                  cityCounty.map((city) => (
                    <CityListItem
                      key={city.CityName}
                      onClick={() => {
                        setCitySelected(city.CityName);
                        setIsCityListShow(false);
                      }}
                    >
                      {city.CityName}
                    </CityListItem>
                  ))
                }
              </CityList>
            </CityListGroup>
            <SearchGroup
              onFocus={() => setIsStationListShow(true)}
              onBlur={() => setIsStationListShow(false)}
            >
              <Search
                value={searchValue}
                setValue={setSearchValue}
                placeholder="請輸入站名"
              />
              <StationListContainer show={isStationListShow}>
                {
                  computeStationsMatchSearch?.length ? (
                    <StationList>
                      {computeStationsMatchSearch?.map(
                        (station) => (
                          <StationItem
                            key={station.StationUID}
                            onClick={() => {
                              setSearchValue(station.StationName.Zh_tw);
                              setCurrentStation(station);
                            }}
                          >
                            <StationItemTitle>{station.StationName.Zh_tw}</StationItemTitle>
                            <StationItemAddress>{station.StationAddress}</StationItemAddress>
                          </StationItem>
                        ),
                      )}
                    </StationList>
                  )
                    : <NoMatchStations><p>換個關鍵字再找找吧！</p></NoMatchStations>
                }
              </StationListContainer>
            </SearchGroup>
            {/* <BusList routes={currentStation?.Stops || []} height="calc(100% - 36px)" /> */}
          </StationSearchPanel>
          <RoutesOffcanvas
            show={false}
            busDirection={busDirection}
            setBusDirection={setBusDirection}
          />
        </StationsContainer>
      </MainContainer>
    </>
  );
};

export default Station;
