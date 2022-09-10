import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import type {
  IEstimate, IBusRoute, IBusStopArriveTime, ThemeProps, IBusRouteDetail, IShapeOfBusRouteRes,
  ShapeOfBusRoute, IGetRouteData,
} from 'react-app-env';
import translateCity from 'utils/translateCity';
import { useLazyGetBusArriveTimeByRouteUidQuery, useLazyGetRouteByRouteUidQuery, useLazyGetSharpOfBusRouteByRouteUidQuery } from 'services/bus';
import { setRouteInOffcanvas, setShapeOfBusRoute } from 'slices/busRoutesSlice';
import { useAppDispatch } from 'hooks';
import {
  useNavigate, useLocation, useParams, useSearchParams,
} from 'react-router-dom';

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
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [getRouteByUidTrigger, { isError }] = useLazyGetRouteByRouteUidQuery();
  const [getBusArriveTimesTrigger] = useLazyGetBusArriveTimeByRouteUidQuery();
  const [getSharpOfBusRouteTrigger] = useLazyGetSharpOfBusRouteByRouteUidQuery();

  const sortBusStopArriveTimesByDirection = (busStops: Array<IBusStopArriveTime>) => busStops
    .reduce((prev, busStop) => {
      const {
        Direction, StopUID, EstimateTime, Estimates = [],
      } = busStop;
      const estimates = [...Estimates];
      estimates[0] = estimates[0] || { EstimateTime };

      if (Direction === 0) {
        prev.directionGo[StopUID] = estimates;
      } else {
        prev.directionReturn[StopUID] = estimates;
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
        { ...stop, Estimates: directionGo[stop.StopUID] || [[]] })),
    };

    if (routesData.length === 2) {
      routesWithBusArriveTime[1] = {
        ...routesData[1],
        Stops: routesData[1].Stops.map((stop) => (
          { ...stop, Estimates: directionReturn[stop.StopUID] || [[]] })),
      };
    }

    return routesWithBusArriveTime;
  };

  type LatLonStrArray = [Array<string>, Array<string>];

  const handleShapeOfBusRouteStrToArr = (shapeData: Array<IShapeOfBusRouteRes>) => {
    const latLonStrArray = (shapeData.map((shape) => shape.Geometry.split('LINESTRING(')[1].split(')')[0].split(',')) as LatLonStrArray);
    const latLonArray = (latLonStrArray.map((latLonStrs) => latLonStrs
      .map((latLonStr) => latLonStr.split(' ').reverse().map((latLon) => Number(latLon)))) as ShapeOfBusRoute);

    return latLonArray;
  };

  const handleOffcanvas = (route: IBusRoute) => {
    if (route.City === 'Kaohsiung') {
      alert(`
        政府 TDX API 資料服務尚未提供高雄查詢！
        推測可能是資料正從 PTX 轉移至 TDX 緣故。
      `);
      return;
    }
    setIsRouteOffcanvasShow(true);
    setSearchOffcanvasShow(false);

    // TODO: test data ------
    // const busArriveTimesData = await fetch(
    //   `${process.env.PUBLIC_URL}/json/Taoyuan_route_106.json`,
    // )
    //   .then((res) => res.json() as Promise<Array<IBusStopArriveTime>>);

    // const routeData = await fetch(`${process.env.PUBLIC_URL}/json/Taoyuan_routes.json`)
    //   .then((res) => res.json() as Promise<Array<IBusRouteDetail>>);
    // TODO:  ------
  };

  useEffect(() => {
    if (isError) { console.warn('getRouteByUidTrigger error'); }
  }, [isError]);

  useEffect(() => {
    const routeUid = searchParams.get('route_uid');
    const routeName = searchParams.get('route_name');

    const getBusRouteData = async () => {
      if (params.city === undefined) return;
      if (routeName === null || routeUid === null) return;
      const reqData: IGetRouteData = {
        city: params.city,
        routeName,
        routeUid,
      };

      try {
        const [
          { data: routeData = [] },
          { data: busArriveTimesData = [] },
          { data: shapeOfBusRoute = [] },
        ] = await Promise.all(
          [
            getRouteByUidTrigger(reqData),
            getBusArriveTimesTrigger(reqData),
            getSharpOfBusRouteTrigger(reqData),
          ],
        );
        const busRouteShapeLatLon = handleShapeOfBusRouteStrToArr(shapeOfBusRoute);
        const busStopArriveTimes = sortBusStopArriveTimesByDirection(busArriveTimesData);
        const routesWithBusArriveTime = mergeBusStopAndArriveTime(routeData, busStopArriveTimes);

        dispatch(setRouteInOffcanvas(routesWithBusArriveTime));
        dispatch(setShapeOfBusRoute(busRouteShapeLatLon));
      } catch (error) { console.error(error); }
    };

    getBusRouteData().catch(() => {});
  }, [location]);

  return (
    <BusListStyle height={height}>
      {routes.map((route) => (
        <BusItem
          key={route.RouteUID}
          onClick={() => {
            navigate({ search: `?route_name=${route.RouteName.Zh_tw}&route_uid=${route.RouteUID}` });
            handleOffcanvas(route);
          }}
        >
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
