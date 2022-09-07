import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import type {
  IEstimate, IBusRoute, IBusStopArriveTime, ThemeProps, IBusRouteDetail,
} from 'react-app-env';
import translateCity from 'utils/translateCity';
import { useLazyGetBusArriveTimeByRouteUidQuery, useLazyGetRouteByRouteUidQuery } from 'services/bus';
import { setRouteInOffcanvas } from 'slices/busRoutesSlice';
import { useAppDispatch } from 'hooks';

const BusListStyle = styled.ul<{ height: string | undefined }>`
  height: ${({ height }) => (height ? `${height}px` : 'auto')};
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
    cursor: pointer;
    transition: transform 0.1s linear;
    &:hover {
      transform: scale(1.03);
    }
    &:active {
      transform: scale(0.98);
    }
  }
  .cityName {
    color: ${({ theme: { colors: { gray_600 } } }) => gray_600};
    font-size: ${({ theme: { fontSizes: { fs_4 } } }) => fs_4};
  }
`;

interface IBusList {
  routes: Array<IBusRoute>;
  height: string;
  setIsRouteOffcanvasShow: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchOffcanvasShow: React.Dispatch<React.SetStateAction<boolean>>
}

interface IBusDirectionSort {
  directionGo: { [key: string]: Array<IEstimate> };
  directionReturn: { [key: string]: Array<IEstimate> };
}

const BusList: React.FC<IBusList> = ({
  routes, height, setIsRouteOffcanvasShow, setSearchOffcanvasShow,
}) => {
  const dispatch = useAppDispatch();
  const [getRouteByUidTrigger, { isError }] = useLazyGetRouteByRouteUidQuery();
  const [getBusArriveTimesTrigger] = useLazyGetBusArriveTimeByRouteUidQuery();

  const sortBusStopArriveTimesByDirection = (busStops: Array<IBusStopArriveTime>) => busStops
    .reduce((prev, busStop) => {
      const { Direction, StopUID } = busStop;

      if (Direction === 0) {
        prev.directionGo[StopUID] = busStop.Estimates;
      } else {
        prev.directionReturn[StopUID] = busStop.Estimates;
      }
      return prev;
    }, { directionGo: {}, directionReturn: {} } as IBusDirectionSort);

  const mergeBusStopAndArriveTime = (
    routesData: Array<IBusRouteDetail>,
    arriveTimesData: IBusDirectionSort,
  ) => {
    const routesWithBusArriveTime = [] as Array<IBusRouteDetail>;
    const { directionGo, directionReturn } = arriveTimesData;

    routesWithBusArriveTime[0] = {
      ...routesData[0],
      Stops: routesData[0].Stops.map((stop) => (
        { ...stop, Estimates: directionGo[stop.StopUID] })),
    };

    routesWithBusArriveTime[1] = {
      ...routesData[1],
      Stops: routesData[1].Stops.map((stop) => (
        { ...stop, Estimates: directionReturn[stop.StopUID] })),
    };

    return routesWithBusArriveTime;
  };

  const handleOffcanvas = async (route: IBusRoute) => {
    setIsRouteOffcanvasShow(true);
    setSearchOffcanvasShow(false);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { City, RouteName: { Zh_tw }, RouteUID } = route;
    const reqData = { city: City, routeName: Zh_tw, routeUid: RouteUID };
    const [{ data: routeData = [] }, { data: busArriveTimesData = [] }] = await Promise.all(
      [getRouteByUidTrigger(reqData), getBusArriveTimesTrigger(reqData)],
    );
    const busStopArriveTimes = sortBusStopArriveTimesByDirection(busArriveTimesData);
    const routesWithBusArriveTime = mergeBusStopAndArriveTime(routeData, busStopArriveTimes);
    dispatch(setRouteInOffcanvas(routesWithBusArriveTime));
  };

  useEffect(() => {
    if (isError) {
      console.warn('getRouteByUidTrigger error');
    }
  }, [isError]);

  return (
    <BusListStyle height={height}>
      {routes.map((route) => (
        <BusItem key={route.RouteUID} onClick={() => { handleOffcanvas(route).catch(() => {}); }}>
          <div>
            <p className="route-num">{route.RouteName.Zh_tw}</p>
            <p className="route-name">{route.DepartureStopNameZh} - {route.DestinationStopNameZh}</p>
          </div>
          <div>
            <span className="material-icons-outlined favorite">favorite_border</span>
            {/* <span className="material-icons-outlined favorite">favorite</span> */}
            <p className="cityName">{translateCity(route.City)}</p>
          </div>
        </BusItem>
      ))}
    </BusListStyle>
  );
};

export default BusList;
