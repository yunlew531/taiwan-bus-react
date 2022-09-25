import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import type { IBusRoute, IStation, ThemeProps } from 'react-app-env';
import Breadcrumb from 'components/Breadcrumb';
import Search from 'components/Search';
import Offcanvas from 'components/Offcanvas';
import TimeBadge from 'components/TimeBadge';
import useGeoLocation from 'hooks/useGeoLocation';
import Leaflet from 'components/Leaflet';
import { useLazyGetRoutesByCityQuery, useLazyGetStationsQuery } from 'services/bus';
import { getDistance } from 'geolib';

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
    display: inline-block;
    font-size: ${({ theme: { fontSizes: { fs_2 } } }) => fs_2};
    font-weight: 700;
    margin: 0 3px 3px 0;
  }
  .bearing {
    font-size: ${({ theme: { fontSizes: { fs_5 } } }) => fs_5};
    color: ${({ theme: { colors: { gray_600 } } }) => gray_600};
  }
  .description{
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
    color: ${({ theme: { colors: { gray_600 } } }) => gray_600};
  }
`;

const DistanceContainer = styled.div<ThemeProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme: { colors: { gray_600 } } }) => gray_600};
  .location {
    font-size: ${({ theme: { fontSizes: { fs_1 } } }) => fs_1};
    margin-right: 3px;
  }
  .distance {
    width: 50px;
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
  .route-direction {
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

enum Bearing {
  'E' = '東',
  'W' = '西',
  'S' = '南',
  'N' = '北',
}

const NearStation: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const { position, county, getGeoLocation } = useGeoLocation();
  const [getStationsTrigger] = useLazyGetStationsQuery();
  const [getRoutesTrigger] = useLazyGetRoutesByCityQuery();
  const [stationsInOneKilometers, setStationsInOneKilometers] = useState<Array<IStation>>([]);
  const [currentOffcanvas, setCurrentOffcanvas] = useState<'station' | 'stop'>('station');
  const [currentStation, setCurrentStation] = useState({} as IStation);
  const [busRoutes, setBusRoutes] = useState<Array<IBusRoute>>([]);

  const mergeRoutesInStation = (routes: Array<IBusRoute>, station: IStation) => {
    const stops = station?.Stops ? [...station.Stops] : [];
    if (!routes.length || !stops.length) return station;

    return {
      ...station,
      Stops: stops.map((stop) => {
        const data = { DepartureStopNameZh: '', DestinationStopNameZh: '' };
        routes.forEach((route) => {
          if (route.RouteUID === stop.RouteUID) {
            const { DepartureStopNameZh, DestinationStopNameZh } = route;
            data.DepartureStopNameZh = DepartureStopNameZh;
            data.DestinationStopNameZh = DestinationStopNameZh;
          }
        });
        return { ...stop, ...data };
      }),
    };
  };

  const handleStationItemClick = (station: IStation) => {
    const stops = [...station.Stops];
    stops.sort((a, b) => (b.RouteUID > a.RouteUID ? -1 : 1));
    setCurrentOffcanvas('stop');

    const stationWithRoutes = mergeRoutesInStation(busRoutes, station);
    setCurrentStation(stationWithRoutes);
  };

  const filterStationsInOneKilometers = (stations: Array<IStation>) => {
    const { latitude, longitude } = position;
    if (!latitude || !longitude) return [];
    if (!stations.length) return [];

    const oneKilometers = 1000;
    return stations.reduce((prev, stationItem) => {
      const station = { ...stationItem };
      const { PositionLat, PositionLon } = station.StationPosition;
      if (PositionLat && PositionLon) {
        const distance = getDistance(
          { latitude, longitude },
          { latitude: PositionLat, longitude: PositionLon },
        );

        const inOneKilometers = distance <= oneKilometers;
        if (inOneKilometers) {
          station.distance = distance;
          prev.push(station);
        }
      }

      return prev;
    }, [] as Array<IStation>).sort((a, b) => a.distance! - b.distance!);
  };

  useEffect(() => {
    getGeoLocation();
  }, []);

  useEffect(() => {
    const getStations = async () => {
      if (!county.en) return;

      const [{ data: stations = [] }, { data: routes = [] }] = await Promise.all([
        getStationsTrigger({ city: county.en }),
        getRoutesTrigger(county.en),
      ]);

      setBusRoutes(routes);
      const stationsInOneKilometersArr = filterStationsInOneKilometers(stations);
      setStationsInOneKilometers(stationsInOneKilometersArr);
    };

    getStations().catch(() => {});
  }, [county]);

  return (
    <>
      <Breadcrumb title="附近站牌" copy timeTable />
      <MainContainer>
        <StationsContainer>
          <Offcanvas show={currentOffcanvas === 'station'}>
            {/* // TODO:}
            {/* <Search value={searchValue} setValue={setSearchValue} placeholder="想去哪裡？" /> */}
            <StationList>
              {
                stationsInOneKilometers.map((station) => (
                  <StationItem
                    key={station.StationUID}
                    onClick={() => handleStationItemClick(station)}
                  >
                    <div>
                      <h2 className="title">{station.StationName.Zh_tw}</h2>
                      <span className="bearing">
                        {station.Bearing.split('').map((str) => Bearing[str as keyof typeof Bearing])}
                      </span>
                      <p className="description">{station.Stops.length} 個站牌</p>
                    </div>
                    <DistanceContainer>
                      <span className="material-icons-outlined location">location_on</span>
                      <span className="distance">{station.distance} m</span>
                    </DistanceContainer>
                  </StationItem>
                ))
              }
            </StationList>
          </Offcanvas>
          <Offcanvas show={currentOffcanvas === 'stop'}>
            <BackToSearchBtn type="button" onClick={() => setCurrentOffcanvas('station')}>
              <span className="material-icons-outlined">chevron_left</span>
              <p>返回搜尋</p>
            </BackToSearchBtn>
            <RoutesContainer>
              <StationNameContainer>
                <h2 className="title">{currentStation.StationName.Zh_tw}</h2>
                <SortTimeBtn>
                  <span className="material-icons-outlined list-icon">list</span>
                  <span className="content">依到站時間排序</span>
                </SortTimeBtn>
              </StationNameContainer>
              <RouteList>
                {currentStation?.Stops?.map((stop) => (
                  <RouteItem key={`${stop.RouteUID}${stop.StopUID!}`}>
                    <RouteContent>
                      <p className="route-num">{stop.RouteName.Zh_tw}</p>
                      <p className="route-direction">{stop.DepartureStopNameZh} - {stop.DestinationStopNameZh}</p>
                    </RouteContent>
                    <FavoriteBtn type="button">
                      <span className="material-icons-outlined favorite">favorite_border</span>
                      {/* <span className="material-icons-outlined favorite">favorite</span> */}
                      <p className="city">{county.zh}</p>
                    </FavoriteBtn>
                  </RouteItem>
                ))}
              </RouteList>
            </RoutesContainer>
          </Offcanvas>
        </StationsContainer>
        <Leaflet
          focusPosition={{ PositionLat: position.latitude, PositionLon: position.longitude }}
        />
      </MainContainer>
    </>
  );
};

export default NearStation;
