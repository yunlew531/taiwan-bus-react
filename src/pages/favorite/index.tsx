import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Breadcrumb from 'components/Breadcrumb';
import type {
  IFavoRoute, IFavoRoutes, IFavoStop, IFavoStops, ThemeProps,
} from 'react-app-env';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useNavigate } from 'react-router-dom';
import { setFavoRoutes, setFavoStops } from 'slices/busRoutesSlice';

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

const FavoriteBusStopBtn = styled.button<ThemeProps & { active: boolean }>`
  font-weight: 700;
  color: ${({ theme: { colors: { white, black } }, active }) => (active ? white : black)};
  background-color: ${({ theme: { colors: { primary, gray_200 } }, active }) => (active ? primary : gray_200)};
`;

const FavoriteBusStationBtn = styled.button<ThemeProps & { active: boolean }>`
  color: ${({ theme: { colors: { black, white } }, active }) => (active ? white : black)};
  background-color: ${({ theme: { colors: { gray_200, primary } }, active }) => (active ? primary : gray_200)};
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
  transition: 0.1s filter linear;
  &:hover {
    filter: brightness(0.7);
  }
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

const AddFavoBtn = styled.button`
  border: none;
  background-color: transparent;
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
  transition: filter 0.1s linear;
  &:hover {
    filter: brightness(0.7);
  }
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

const Favorite: React.FC = () => {
  const favoRoutes = useAppSelector((state) => state.busRoutes.favoRoutes);
  const favoStops = useAppSelector((state) => state.busRoutes.favoStops);
  const [favoRoutesArr, setFavoRoutesArr] = useState<Array<IFavoRoute>>([]);
  const [favoStopsArr, setFavoStopsArr] = useState<Array<IFavoStop>>([]);
  const [currentDisplay, setCurrentDisplay] = useState<'routes' | 'stops'>('routes');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleFavoRouteClick = (routeItem: IFavoRoute) => {
    const { city, routeUid, zhName } = routeItem;
    const search = `?city=${city}/&route_uid=${routeUid}&route_name=${zhName}&favo_data=${JSON.stringify(routeItem)}`;

    navigate({
      pathname: `/bus/${city}`,
      search,
    });
  };

  const handleFavoStopClick = (stopItem: IFavoStop) => {
    const {
      city, routeUid, routeName, position,
    } = stopItem;
    const search = `?city=${city}/&route_uid=${routeUid}&route_name=${routeName}&favo_data=${JSON.stringify(stopItem)}&station_position=${JSON.stringify(position)}`;

    navigate({
      pathname: `/bus/${city}`,
      search,
    });
  };

  const removeRouteFavorite = (favoRoute: IFavoRoute) => {
    const { routeUid } = favoRoute;
    const routesData = {
      ...favoRoutes,
      [routeUid]: null,
    };

    localStorage.setItem('favoRoutes', JSON.stringify(routesData));
    dispatch(setFavoRoutes(routesData));
  };

  const removeStopFavorite = (favoStop: IFavoStop) => {
    const { routeUid } = favoStop;
    const favoStopsData = {
      ...favoStops,
      [routeUid]: null,
    };

    localStorage.setItem('favoStops', JSON.stringify(favoStopsData));
    dispatch(setFavoStops(favoStopsData));
  };

  useEffect(() => {
    const formatFavoRoutesToArr = (favoRoutesData: IFavoRoutes) => {
      const values = Object.values(favoRoutesData);
      const favoRoutesArrData = Object.keys(favoRoutesData).map((favoRoute, idx) => values[idx])
        .filter((route) => route) as Array<IFavoRoute>;
      setFavoRoutesArr(favoRoutesArrData);
    };

    formatFavoRoutesToArr(favoRoutes);
  }, [favoRoutes]);

  useEffect(() => {
    const formatFavoStopsToArr = (favoStopsData: IFavoStops) => Object.values(favoStopsData)
      .filter((favoStop) => favoStop) as Array<IFavoStop>;

    const favoStopsData = formatFavoStopsToArr(favoStops);

    setFavoStopsArr(favoStopsData);
  }, [favoStops]);

  return (
    <>
      <Breadcrumb title="我的收藏" />
      <MainContainer>
        <FavoriteContainer>
          <FavoriteBtnGroup>
            <FavoriteBusStopBtn
              type="button"
              onClick={() => setCurrentDisplay('routes')}
              active={currentDisplay === 'routes'}
            >收藏路線
            </FavoriteBusStopBtn>
            <FavoriteBusStationBtn
              type="button"
              onClick={() => setCurrentDisplay('stops')}
              active={currentDisplay === 'stops'}
            >收藏站點
            </FavoriteBusStationBtn>
          </FavoriteBtnGroup>
          <CitySelector>
            <Selected>
              <p className="title">臺北市</p>
              <span className="material-icons-outlined expand-more">expand_more</span>
            </Selected>
            <CityList show={false}>
              <CityItem>臺北市</CityItem>
              <CityItem>臺北市</CityItem>
              <CityItem>臺北市</CityItem>
            </CityList>
          </CitySelector>
          <BusStationList show={currentDisplay === 'routes'}>
            {favoRoutesArr.map((favoRoute) => (
              <BusStationItem
                key={favoRoute.routeUid}
                onClick={() => handleFavoRouteClick(favoRoute)}
              >
                <div>
                  <span className="bus-description">{favoRoute.departureStop} - {favoRoute.destinationStop}</span>
                  <p className="bus-station">{favoRoute.zhName}</p>
                </div>
                <FavoriteGroup>
                  <AddFavoBtn
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      removeRouteFavorite(favoRoute);
                    }}
                  >
                    <span className="material-icons-outlined favorite">favorite</span>
                  </AddFavoBtn>
                  <p className="title">{favoRoute.zhCity}</p>
                </FavoriteGroup>
              </BusStationItem>
            ))}

          </BusStationList>
          <BusStopList show={currentDisplay === 'stops'}>
            {favoStopsArr.map((favoStop) => (
              <BusStopItem key={favoStop.routeUid} onClick={() => handleFavoStopClick(favoStop)}>
                <div>
                  <p className="bus-number">{favoStop.routeName}</p>
                  <p className="content">{favoStop.stopName}</p>
                </div>
                <FavoriteGroup>
                  <AddFavoBtn
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      removeStopFavorite(favoStop);
                    }}
                  >
                    <span className="material-icons-outlined favorite">favorite</span>
                  </AddFavoBtn>
                  <p className="title">{favoStop.zhCity}</p>
                </FavoriteGroup>
              </BusStopItem>
            ))}
          </BusStopList>
        </FavoriteContainer>
      </MainContainer>
    </>
  );
};

export default Favorite;
