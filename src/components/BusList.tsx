import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import type {
  IEstimate, IBusRoute, IBusStopArriveTime, ThemeProps, IBusRouteDetail, IShapeOfBusRouteRes,
  ShapeOfBusRoute, IGetRouteData, IBusNearStop, BusNearStop, IFavoRoutes,
} from 'react-app-env';
import translateCity from 'utils/translateCity';
import {
  useLazyGetBusArriveTimeByRouteUidQuery, useLazyGetRouteByRouteUidQuery,
  useLazyGetSharpOfBusRouteByRouteUidQuery, useLazyGetBusNearStopQuery,
} from 'services/bus';
import {
  setBusNearStop, setBusRoutes, setFavoRoutes, setRouteInOffcanvas, setShapeOfBusRoute,
} from 'slices/busRoutesSlice';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import mergeFavoRoutesInBusRoutes from 'utils/mergeFavoRoutesInBusRoutes';
import mergeFavoRouteInBusRouteDetail from 'utils/mergeFavoRouteInBusRouteDetail';

const BusListStyle = styled.ul`
  height: 100%;
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
}

interface IBusDirectionSort {
  directionGo: { [key: string]: Array<IEstimate> };
  directionReturn: { [key: string]: Array<IEstimate> };
}

const BusList: React.FC<IBusList> = ({ routes }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [getRouteByUidTrigger, { isError }] = useLazyGetRouteByRouteUidQuery();
  const [getBusArriveTimesTrigger] = useLazyGetBusArriveTimeByRouteUidQuery();
  const [getSharpOfBusRouteTrigger] = useLazyGetSharpOfBusRouteByRouteUidQuery();
  const [getBusNearStopTrigger] = useLazyGetBusNearStopQuery();
  const busRoutes = useAppSelector((state) => state.busRoutes.busRoutes);
  const favoRoutes = useAppSelector((state) => state.busRoutes.favoRoutes);

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

  const formatShapeOfBusRouteStrToArr = (shapeData: Array<IShapeOfBusRouteRes>) => {
    const latLonStrArray = shapeData.map((shape) => {
      const str = params.city === 'Taipei&NewTaipei' ? ' ' : '';

      return shape.Geometry.replace(`LINESTRING${str}`, '').replace('MULTI((', '').split(',');
    }) as LatLonStrArray;
    const latLonArray = latLonStrArray.map((latLonStrs) => latLonStrs
      .map((latLonStr) => latLonStr.split(' ').filter((str) => str).reverse()
        .map((latLon) => Number(latLon.replaceAll('(', '').replaceAll(')', ''))))) as ShapeOfBusRoute;

    return latLonArray;
  };

  const formatBusNearStop = (busNearStops: Array<IBusNearStop>) => {
    const result = busNearStops.reduce((prev, busNearStop) => {
      if (busNearStop.Direction === 0) prev[0]?.push(busNearStop);
      else if (busNearStop.Direction === 1) prev[1]?.push(busNearStop);
      return prev;
    }, [[], []] as BusNearStop);

    return result;
  };

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

  useEffect(() => {
    const getBusRouteData = async () => {
      const routeUid = searchParams.get('route_uid');
      const routeName = searchParams.get('route_name');
      const city = searchParams.get('city');

      if (city === 'Kaohsiung') {
        alert(`
          政府 TDX API 資料服務尚未提供高雄查詢！
          推測可能是資料正從 PTX 轉移至 TDX 緣故。
        `);
        return;
      }

      if (routeName === null || routeUid === null || city === null) return;

      const reqData: IGetRouteData = {
        city,
        routeName,
        routeUid,
      };

      try {
        const [
          { data: routeData = [] },
          { data: busArriveTimesData = [] },
          { data: shapeOfBusRoute = [] },
          { data: busNearStopData = [] },
        ] = await Promise.all(
          [
            getRouteByUidTrigger(reqData),
            getBusArriveTimesTrigger(reqData),
            getSharpOfBusRouteTrigger(reqData),
            getBusNearStopTrigger(reqData),
          ],
        );
        const busRouteShapeLatLon = formatShapeOfBusRouteStrToArr(shapeOfBusRoute);
        const busStopArriveTimes = sortBusStopArriveTimesByDirection(busArriveTimesData);
        const routesWithBusArriveTime = mergeBusStopAndArriveTime(routeData, busStopArriveTimes);
        const routeDetailData = mergeFavoRouteInBusRouteDetail(favoRoutes, routesWithBusArriveTime);
        const busNearStop = formatBusNearStop(busNearStopData);

        dispatch(setRouteInOffcanvas(routeDetailData));
        dispatch(setShapeOfBusRoute(busRouteShapeLatLon));
        dispatch(setBusNearStop(busNearStop));
      } catch (error) { console.error(error); }
    };

    getBusRouteData().catch(() => {});
  }, [location]);

  return (
    <BusListStyle>
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

export default BusList;
