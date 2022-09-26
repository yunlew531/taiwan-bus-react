import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import type {
  IBusRoute, IFavoStop, IFavoStops, IStation, IStopInStation, ThemeProps,
} from 'react-app-env';
import Breadcrumb from 'components/Breadcrumb';
import Search from 'components/Search';
import Offcanvas from 'components/Offcanvas';
import useGeoLocation from 'hooks/useGeoLocation';
import Leaflet from 'components/Leaflet';
import { useLazyGetRoutesByCityQuery, useLazyGetStationsQuery } from 'services/bus';
import { getDistance } from 'geolib';
import { useAppDispatch, useAppSelector } from 'hooks';
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
    display: none;
    font-size: ${({ theme: { fontSizes: { fs_1 } } }) => fs_1};
    &.show {
      display: block;
    }
  }
`;

enum Bearing {
  'E' = '東',
  'W' = '西',
  'S' = '南',
  'N' = '北',
}

const NearStation: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState('');
  const { position, county, getGeoLocation } = useGeoLocation();
  const [getStationsTrigger] = useLazyGetStationsQuery();
  const [getRoutesTrigger] = useLazyGetRoutesByCityQuery();
  const [stationsInOneKilometers, setStationsInOneKilometers] = useState<Array<IStation>>([]);
  const [currentOffcanvas, setCurrentOffcanvas] = useState<'station' | 'stop'>('station');
  const [currentStation, setCurrentStation] = useState({} as IStation);
  const [busRoutes, setBusRoutes] = useState<Array<IBusRoute>>([]);
  const favoStops = useAppSelector((state) => state.busRoutes.favoStops);

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

  const mergeFavoInStops = (favoStopsData: IFavoStops, station: IStation) => ({
    ...station,
    Stops: station.Stops.map((stop) => {
      let isFavorite = false;
      const isStopInFavo = favoStopsData[stop.StopUID!];
      const isSameRoute = favoStopsData[stop.StopUID!]?.routeUid === stop.RouteUID;
      if (isStopInFavo && isSameRoute) { isFavorite = true; }

      return {
        ...stop,
        isFavorite,
      };
    }),
  });

  const handleStationItemClick = (station: IStation) => {
    const stops = [...station.Stops];
    stops.sort((a, b) => (b.RouteUID > a.RouteUID ? -1 : 1));
    setCurrentOffcanvas('stop');

    const stationWithRoutes = mergeRoutesInStation(busRoutes, station);
    const stopsInStationWithFavorite = mergeFavoInStops(favoStops, stationWithRoutes);

    setCurrentStation(stopsInStationWithFavorite);
  };

  const toggleStopFavo = (stop: IStopInStation) => {
    const {
      StopName, StopUID, RouteName, RouteUID, DepartureStopNameZh, DestinationStopNameZh,
    } = stop;
    const { PositionLat, PositionLon } = currentStation.StationPosition;

    if (stop.isFavorite) {
      const updatedStopFavo = {
        ...favoStops,
        [StopUID!]: null,
      };
      dispatch(setFavoStops(updatedStopFavo));
      localStorage.setItem('favoStops', JSON.stringify(updatedStopFavo));
    } else {
      const favoData: IFavoStop = {
        city: county.en,
        zhCity: county.zh,
        routeName: RouteName.Zh_tw,
        routeUid: RouteUID,
        destinationStop: DestinationStopNameZh!,
        departureStop: DepartureStopNameZh!,
        stopName: StopName!.Zh_tw,
        stopUid: StopUID!,
        position: {
          PositionLat,
          PositionLon,
        },
      };
      const updatedStopFavo = {
        ...favoStops,
        [StopUID!]: favoData,
      };

      dispatch(setFavoStops(updatedStopFavo));
      localStorage.setItem('favoStops', JSON.stringify(updatedStopFavo));
    }
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

  useEffect(() => {
    const updateStation = () => {
      if (!currentStation.Stops?.length) return;
      const stopsInStationWithFavorite = mergeFavoInStops(favoStops, currentStation);
      setCurrentStation(stopsInStationWithFavorite);
    };

    updateStation();
  }, [favoStops]);

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
                <h2 className="title">{currentStation?.StationName?.Zh_tw}</h2>
              </StationNameContainer>
              <RouteList>
                {currentStation?.Stops?.map((stop) => (
                  <RouteItem key={`${stop.RouteUID}${stop.StopUID!}`}>
                    <RouteContent>
                      <p className="route-num">{stop.RouteName.Zh_tw}</p>
                      <p className="route-direction">{stop.DepartureStopNameZh} - {stop.DestinationStopNameZh}</p>
                    </RouteContent>
                    <FavoriteBtn
                      type="button"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        toggleStopFavo(stop);
                      }}
                    >
                      <span className={`material-icons-outlined favorite ${stop.isFavorite ? '' : 'show'}`}>favorite_border</span>
                      <span className={`material-icons-outlined favorite ${stop.isFavorite ? 'show' : ''}`}>favorite</span>
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
