import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import type {
  IBusRoute, ThemeProps, IFavoRoutes,
} from 'react-app-env';
import translateCity from 'utils/translateCity';
import { setBusRoutes, setFavoRoutes } from 'slices/busRoutesSlice';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useLocation, useSearchParams } from 'react-router-dom';
import mergeFavoRoutesInBusRoutes from 'utils/mergeFavoRoutesInBusRoutes';

const BusListStyle = styled.ul<{ height: string; }>`
  height: ${({ height }) => height};
  overflow-y: auto;
  padding: 0 15px;
  margin-top: 36px;
`;

const BusItem = styled.li<ThemeProps>`
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

interface IBusList {
  routes: Array<IBusRoute>;
  height?: string;
}

const BusList: React.FC<IBusList> = ({ routes = [], height }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const busRoutes = useAppSelector((state) => state.busRoutes.busRoutes);
  const favoRoutes = useAppSelector((state) => state.busRoutes.favoRoutes);

  const toggleRouteFavo = (busRoute: IBusRoute) => {
    const {
      City, RouteUID, RouteName: { Zh_tw: zhName, En: engName }, DepartureStopNameZh,
      DestinationStopNameZh, isFavorite,
    } = busRoute;

    let updatedFavoData: IFavoRoutes;
    if (!isFavorite) {
      const routeData = {
        city: City,
        zhCity: translateCity(City),
        departureStop: DepartureStopNameZh,
        destinationStop: DestinationStopNameZh,
        zhName,
        engName,
        routeUid: RouteUID,
      };

      updatedFavoData = { ...favoRoutes, [RouteUID]: routeData };
    } else {
      updatedFavoData = { ...favoRoutes, [RouteUID]: null };
    }
    localStorage.setItem('favoRoutes', JSON.stringify(updatedFavoData));
    dispatch(setFavoRoutes(updatedFavoData));
  };

  const handleBusItemClick = (route: IBusRoute) => {
    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      RouteName: { Zh_tw: route_name, En: engName }, RouteUID: route_uid, City: city,
      DepartureStopNameZh, DestinationStopNameZh,
    } = route;
      // eslint-disable-next-line @typescript-eslint/naming-convention
    const favo_data = {
      city,
      zhCity: translateCity(city),
      departureStop: DepartureStopNameZh,
      destinationStop: DestinationStopNameZh,
      zhName: route_name,
      engName,
      routeUid: route_uid,
    };
    setSearchParams({
      city, route_name, route_uid, favo_data: JSON.stringify(favo_data),
    });
  };

  useEffect(() => {
    const updateBusRoutes = () => {
      let busRoutesData = [...busRoutes];
      busRoutesData = mergeFavoRoutesInBusRoutes(favoRoutes, busRoutesData);

      dispatch(setBusRoutes(busRoutesData));
    };

    updateBusRoutes();
  }, [favoRoutes]);

  return (
    <BusListStyle height={height!}>
      {routes.map((route) => (
        <BusItem
          key={route.RouteUID}
          onClick={() => handleBusItemClick(route)}
        >
          <div>
            <p className="route-num">{route.RouteName.Zh_tw}</p>
            <p className="route-name">{route.DepartureStopNameZh} - {route.DestinationStopNameZh}</p>
          </div>
          <div>
            <AddFavoBtn
              type="button"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                toggleRouteFavo(route);
              }}
            >
              {route.isFavorite ? <span className="material-icons-outlined favorite">favorite</span>
                : <span className="material-icons-outlined favorite">favorite_border</span>}
            </AddFavoBtn>
            <p className="cityName">{translateCity(route.City)}</p>
          </div>
        </BusItem>
      ))}
    </BusListStyle>
  );
};

BusList.defaultProps = {
  height: '100%',
};

export default BusList;
