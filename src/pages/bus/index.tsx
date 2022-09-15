import styled from '@emotion/styled';
import React, { useEffect, useMemo, useState } from 'react';
import type {
  BusNearStop,
  IBusNearStop,
  IBusRoute, IBusRouteDetail, IBusStopArriveTime, IEstimate, IFavoRoutes, IGetRouteData,
  IShapeOfBusRouteRes, ShapeOfBusRoute, ThemeProps,
} from 'react-app-env';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import Breadcrumb from 'components/Breadcrumb';
import BusList from 'components/BusList';
import Search from 'components/Search';
import RoutesOffcanvas from 'components/RoutesOffcanvas';
import {
  useLazyGetBusArriveTimeByRouteUidQuery, useLazyGetBusNearStopQuery,
  useLazyGetRouteByRouteUidQuery, useLazyGetRoutesByCityQuery,
  useLazyGetSharpOfBusRouteByRouteUidQuery,
} from 'services/bus';
import { useAppDispatch, useAppSelector } from 'hooks';
import {
  setBusNearStop, setBusRoutes, setRouteInOffcanvas, setShapeOfBusRoute,
} from 'slices/busRoutesSlice';
import translateCity from 'utils/translateCity';
import Leaflet from 'components/Leaflet';
import mergeFavoRoutesInBusRoutes from 'utils/mergeFavoRoutesInBusRoutes';
import mergeFavoRouteInBusRouteDetail from 'utils/mergeFavoRouteInBusRouteDetail';

const MainContainer = styled.div`
  position: absolute;
  top: 36px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: stretch;
`;

const RoutesContainer = styled.div`
  position: relative;
  max-width: 464px;
  width: 100%;
`;

const BusSearchPanel = styled.div<ThemeProps & { show: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.15);
  background: ${({ theme: { colors: { white } } }) => white};
  transition: 0.3s transform linear;
  transform: ${({ show }) => (show ? 'translateX(0)' : 'translateX(-100%)')};
`;

const BusListPanel = styled.div<ThemeProps>`
  height: calc(100% - 341px);
  padding: 20px;
`;

const NumberBoard = styled.div<ThemeProps>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  text-align: center;
  background-color: ${({ theme: { colors: { gray_100 } } }) => gray_100};
  border-top: 1px solid ${({ theme: { colors: { gray_400 } } }) => gray_400};
  padding: 33px;
`;

const NumberBtnsGroup = styled.div`
  max-width: 292px;
  width: 100%;
  margin: 0 -2% -2% 0;
`;

const NumberBtn = styled.button<ThemeProps>`
  width: 28.333%;
  height: 40px;
  background-color: ${({ theme: { colors: { gray_500 } } }) => gray_500};
  border: none;
  border-radius: 10px;
  margin: 0 5% 12px 0;
  transition: transform 0.1s linear, color 0.1s linear;
  &:hover {
    color: ${({ theme: { colors: { gray_700 } } }) => gray_700};
    transform: scale(1.03);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const DedicatedBtn = styled(NumberBtn)<ThemeProps>`
  color: ${({ theme: { colors: { white } } }) => white};
  background-color: ${({ theme: { colors: { darkBlue } } }) => darkBlue};
  &:hover {
    color: ${({ theme: { colors: { white } } }) => white};
  }
`;

const Bus: React.FC = () => {
  const { city: cityParams } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [getRoutesTrigger] = useLazyGetRoutesByCityQuery();
  const busRoutes = useAppSelector((state) => state.busRoutes.busRoutes);
  const busRoute = useAppSelector((state) => state.busRoutes.currentRouteInOffcanvas);
  const shapeOfBusRoute = useAppSelector((state) => state.busRoutes.shapeOfBusRoute);
  const busNearStop = useAppSelector((state) => state.busRoutes.busNearStop);
  const [searchValue, setSearchValue] = useState('');
  const [busDirection, setBusDirection] = useState<0 | 1>(0);
  const favoRoutes = useAppSelector((state) => state.busRoutes.favoRoutes);
  const [getRouteByUidTrigger, { isError }] = useLazyGetRouteByRouteUidQuery();
  const [getBusArriveTimesTrigger] = useLazyGetBusArriveTimeByRouteUidQuery();
  const [getSharpOfBusRouteTrigger] = useLazyGetSharpOfBusRouteByRouteUidQuery();
  const [getBusNearStopTrigger] = useLazyGetBusNearStopQuery();
  const params = useParams();

  interface IBusDirectionSort {
    directionGo: { [key: string]: Array<IEstimate> };
    directionReturn: { [key: string]: Array<IEstimate> };
  }

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

  const formatBusNearStopBYDirection = (busNearStops: Array<IBusNearStop>) => {
    const result = busNearStops.reduce((prev, busNearStopItem) => {
      if (busNearStopItem.Direction === 0) prev[0]?.push(busNearStopItem);
      else if (busNearStopItem.Direction === 1) prev[1]?.push(busNearStopItem);
      return prev;
    }, [[], []] as BusNearStop);

    return result;
  };

  useEffect(() => {
    const getRoutes = async () => {
      if (!cityParams) return;
      if (cityParams === 'Other_City') return;

      let routesData: Array<IBusRoute>;
      try {
        if (cityParams === 'Taipei&NewTaipei') {
          const [{ data: taipeiRoutes = [] }, { data: newTaipeiRoutes = [] }] = await Promise.all([
            getRoutesTrigger('Taipei'),
            getRoutesTrigger('NewTaipei'),
          ]);

          routesData = [...taipeiRoutes, ...newTaipeiRoutes];
        } else {
          const { data = [] } = await getRoutesTrigger(cityParams);
          routesData = data;
        }
        routesData = mergeFavoRoutesInBusRoutes(favoRoutes, routesData);

        dispatch(setBusRoutes(routesData));
      } catch (err) { console.error(err); }
    };
    getRoutes().catch(() => {});

    return () => {
      dispatch(setBusRoutes([]));
    };
  }, []);

  const [isRouteOffcanvasOpen, setIsRouteOffcanvasShow] = useState(false);
  const [isSearchOffcanvasOpen, setSearchOffcanvasShow] = useState(true);

  useEffect(() => {
    const handleSearching = () => {
      const routeName = searchParams.get('route_name');
      const routeUid = searchParams.get('route_uid');
      const city = searchParams.get('city');
      const isSearching = routeName && routeUid && city;

      if (isSearching) {
        if (city === 'Kaohsiung') return;
        setIsRouteOffcanvasShow(true);
        setSearchOffcanvasShow(false);
      } else {
        setIsRouteOffcanvasShow(false);
        setSearchOffcanvasShow(true);
      }
    };

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
          { data: shapeOfBusRouteData = [] },
          { data: busNearStopData = [] },
        ] = await Promise.all(
          [
            getRouteByUidTrigger(reqData),
            getBusArriveTimesTrigger(reqData),
            getSharpOfBusRouteTrigger(reqData),
            getBusNearStopTrigger(reqData),
          ],
        );
        const busRouteShapeLatLon = formatShapeOfBusRouteStrToArr(shapeOfBusRouteData);
        const busStopArriveTimes = sortBusStopArriveTimesByDirection(busArriveTimesData);
        const routesWithBusArriveTime = mergeBusStopAndArriveTime(routeData, busStopArriveTimes);
        const routeDetailData = mergeFavoRouteInBusRouteDetail(favoRoutes, routesWithBusArriveTime);
        const busNearStopWithDirection = formatBusNearStopBYDirection(busNearStopData);

        dispatch(setRouteInOffcanvas(routeDetailData));
        dispatch(setShapeOfBusRoute(busRouteShapeLatLon));
        dispatch(setBusNearStop(busNearStopWithDirection));
      } catch (error) { console.error(error); }
    };

    getBusRouteData().catch(() => {});

    handleSearching();
  }, [location]);

  const busRoutesFilter = useMemo(
    () => (searchValue ? busRoutes.filter(
      (route) => route.RouteName.Zh_tw.match(searchValue),
    ) : busRoutes),
    [searchValue, busRoutes],
  );

  const chineseCity = translateCity(cityParams || '');

  const resetSearch = () => setSearchValue('');

  const handleNumberBoard = (e: React.MouseEvent) => {
    const clickNum = (e.target as HTMLButtonElement).textContent as string;
    setSearchValue((prev) => `${prev}${clickNum}`);
  };

  return (
    <>
      <Breadcrumb title={chineseCity} copy timeTable />
      <MainContainer>
        <RoutesContainer>
          <BusSearchPanel show={isSearchOffcanvasOpen}>
            <BusListPanel>
              <Search
                value={searchValue}
                setValue={setSearchValue}
                placeholder="輸入公車路線 / 起迄方向名或關鍵字"
              />
              <BusList
                routes={busRoutesFilter}
              />
            </BusListPanel>
            <NumberBoard>
              <NumberBtnsGroup>
                { Array.from(Array(9).keys()).map(
                  (item) => <NumberBtn key={item} onClick={handleNumberBoard} type="button">{item + 1}</NumberBtn>,
                )}
                <DedicatedBtn type="button">專用道</DedicatedBtn>
                <NumberBtn onClick={handleNumberBoard} type="button">0</NumberBtn>
                <NumberBtn onClick={resetSearch} type="button">清除</NumberBtn>
              </NumberBtnsGroup>
            </NumberBoard>
          </BusSearchPanel>
          <RoutesOffcanvas
            show={isRouteOffcanvasOpen}
            busDirection={busDirection}
            setBusDirection={setBusDirection}
          />
        </RoutesContainer>
        <Leaflet
          busRoute={busRoute[busDirection] || {}}
          shapeOfBusRoute={shapeOfBusRoute[busDirection] || shapeOfBusRoute[0] || []}
          busNearStop={busNearStop[busDirection] || []}
        />
      </MainContainer>
    </>
  );
};

export default Bus;
