import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumb from 'components/Breadcrumb';
import styled from '@emotion/styled';
import Search from 'components/Search';
import type {
  IBusRoute, ICityCounty, IStation, IStopInStation, ThemeProps,
} from 'react-app-env';
import RoutesOffcanvas from 'components/RoutesOffcanvas';
import { useLazyGetRoutesByCityQuery, useLazyGetStationsQuery } from 'services/bus';
import translateCity from 'utils/translateCity';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from 'hooks';
import { setFavoStops } from 'slices/busRoutesSlice';

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

const StopsList = styled.ul`
  height: calc(100% - 118px);
  overflow-y: auto;
  padding: 0 15px;
  margin-top: 36px;
`;

const StopItem = styled.li<ThemeProps>`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme: { colors: { gray_400 } } }) => gray_400};
  text-align: center;
  transition: filter 0.1s linear;
  &:hover {
    filter: brightness(0.7);
  }
  .route-num {
    font-size: ${({ theme: { fontSizes: { fs_1 } } }) => fs_1};
    font-weight: 700;
    margin-bottom: 5px;
    text-align: left;
  }
  .route-name {
    color: ${({ theme: { colors: { gray_600 } } }) => gray_600};
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
    text-align: left;
  }
  .material-icons-outlined.favorite {
    font-size: 20px;
    margin-bottom: 5px;
  }
  .cityName {
    color: ${({ theme: { colors: { gray_600 } } }) => gray_600};
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  }
`;

const AddFavoBtn = styled.button`
  border: none;
  background-color: transparent;
`;

const Station: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [busDirection, setBusDirection] = useState<0 | 1>(0);
  const [cityCounty, setCityCounty] = useState<Array<ICityCounty>>([]);
  const [citySelected, setCitySelected] = useState({ zh: '臺北市', en: 'Taipei' });
  const [isCityListShow, setIsCityListShow] = useState(false);
  const [isStationListShow, setIsStationListShow] = useState(false);
  const [currentStation, setCurrentStation] = useState({} as IStation);
  const [
    currentStationWithRouteAndFavo,
    setCurrentStationWithRouteAndFavo,
  ] = useState({} as IStation);
  const [busRoutes, setBusRoutes] = useState<Array<IBusRoute>>([]);
  const [getStationsTrigger, { data: stations }] = useLazyGetStationsQuery();
  const [getRoutesTrigger, { data: routesData }] = useLazyGetRoutesByCityQuery();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favoStops = useAppSelector((state) => state.busRoutes.favoStops);

  const fetchCityCounty = () => {
    fetch(`${process.env.PUBLIC_URL}/json/CityCountyData.json`)
      .then((res) => res.json() as Promise<Array<ICityCounty>>)
      .then((cityData) => { setCityCounty(cityData); })
      .catch(() => {});
  };

  const toggleStopFavo = (stop: IStopInStation) => {
    const favoStopsData = { ...favoStops };
    const {
      RouteUID, RouteName: { Zh_tw: routeName }, DestinationStopNameZh = '', DepartureStopNameZh,
      StopName: { Zh_tw: stopName } = {}, StopUID,
    } = stop;

    const localStop = {
      routeName,
      stopName: stopName!,
      routeUid: RouteUID,
      stopUid: StopUID!,
      destinationStop: DestinationStopNameZh,
      departureStop: DepartureStopNameZh!,
      city: citySelected.en,
      zhCity: citySelected.zh,
      position: currentStation.StationPosition,
    };
    const isStopFavo = favoStopsData[RouteUID];

    if (!isStopFavo) {
      favoStopsData[RouteUID] = localStop;
    } else {
      favoStopsData[RouteUID] = null;
    }

    const localStopStr = JSON.stringify(favoStopsData);

    localStorage.setItem('favoStops', localStopStr);
    dispatch(setFavoStops(favoStopsData));
  };

  const computeStationsMatchSearch = useMemo(
    () => stations
      ?.filter((station) => station.StationName.Zh_tw.match(searchValue))
      .filter((item, idx) => idx < 300),
    [stations, searchValue],
  );

  useEffect(() => {
    fetchCityCounty();
  }, []);

  useEffect(() => {
    const getRoutes = () => {
      getRoutesTrigger(citySelected.en).catch(() => {});
      getStationsTrigger({ city: citySelected.en }).catch(() => {});
    };

    getRoutes();
  }, [citySelected]);

  const mergeStationWithRoute = (stops: Array<IStopInStation>) => {
    const mergeData: Array<IStopInStation> = [];
    routesData?.forEach((routeData) => {
      stops.forEach((stop) => {
        if (routeData.RouteUID === stop.RouteUID) {
          mergeData.push({
            ...stop,
            DepartureStopNameZh: routeData.DepartureStopNameZh,
            DestinationStopNameZh: routeData.DestinationStopNameZh,
          });
        }
      });
    });

    return mergeData;
  };

  const mergeStopWithFavorite = (stops: Array<IStopInStation>) => stops.map((stop) => {
    if (favoStops[stop.RouteUID]) stop.isFavorite = true;

    return stop;
  });

  useEffect(() => {
    const stopsWithRoute = mergeStationWithRoute(currentStation.Stops);
    const stopsWithFavorite = mergeStopWithFavorite(stopsWithRoute);
    setCurrentStationWithRouteAndFavo({
      ...currentStation,
      Stops: stopsWithFavorite,
    });
  }, [currentStation, favoStops]);

  useEffect(() => {
    if (routesData) { setBusRoutes(routesData); }
  }, [routesData]);

  return (
    <>
      <Breadcrumb title="站點查詢" copy timeTable />
      <MainContainer>
        <StationsContainer>
          <StationSearchPanel show>
            <CityListGroup>
              <CityListSelectedBtn onClick={() => { setIsCityListShow(!isCityListShow); }}>
                <p>{citySelected.zh}</p>
                <span className="material-icons-outlined expend-more">expand_more</span>
              </CityListSelectedBtn>
              <CityList show={isCityListShow}>
                {
                  cityCounty.map((city) => (
                    <CityListItem
                      key={city.CityName}
                      onClick={() => {
                        setCitySelected({ zh: city.CityName, en: translateCity(city.CityName, 'en') });
                        setIsCityListShow(false);
                        setSearchValue('');
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
                    : <NoMatchStations><p>換個關鍵字再找找！</p></NoMatchStations>
                }
              </StationListContainer>
            </SearchGroup>
            <StopsList>
              {currentStationWithRouteAndFavo.Stops?.map((stop) => (
                <StopItem
                  key={stop.StopUID}
                  onClick={() => {
                    const favoData = {
                      zhName: stop.RouteName.Zh_tw || '',
                      engName: stop.RouteName.En,
                      routeUid: stop.RouteUID,
                      city: citySelected.en,
                      zhCity: citySelected.zh,
                      departureStop: stop.DepartureStopNameZh,
                      destinationStop: stop.DestinationStopNameZh,
                    };

                    const favoDataStr = JSON.stringify(favoData);

                    navigate({
                      pathname: `/bus/${citySelected.en}`,
                      search: `?route_name=${stop.RouteName.Zh_tw}&route_uid=${stop.RouteUID}&city=${citySelected.en}&stop=${stop.StopName?.Zh_tw || ''}&favo_data=${favoDataStr}`,
                    });
                  }}
                >
                  <div>
                    <p className="route-num">{stop.RouteName.Zh_tw}</p>
                    <p className="route-name">往 {stop.DepartureStopNameZh}</p>
                  </div>
                  <div>
                    <AddFavoBtn
                      type="button"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        toggleStopFavo(stop);
                      }}
                    >
                      {stop.isFavorite ? <span className="material-icons-outlined favorite">favorite</span>
                        : <span className="material-icons-outlined favorite">favorite_border</span>}
                    </AddFavoBtn>
                    <p className="cityName">{citySelected.zh}</p>
                  </div>
                </StopItem>
              ))}
            </StopsList>
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
