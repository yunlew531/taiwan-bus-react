import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import type { IBusRoute, ThemeProps } from 'react-app-env';
import translateCity from 'utils/translateCity';
import { useLazyGetRouteByRouteUidQuery } from 'services/bus';
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

const BusList: React.FC<IBusList> = ({
  routes, height, setIsRouteOffcanvasShow, setSearchOffcanvasShow,
}) => {
  const dispatch = useAppDispatch();
  const [getRouteByIdTrigger, { data: routeData }] = useLazyGetRouteByRouteUidQuery();

  const handleOffcanvas = (route: IBusRoute) => {
    setIsRouteOffcanvasShow(true);
    setSearchOffcanvasShow(false);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { City, RouteName: { Zh_tw }, RouteUID } = route;

    getRouteByIdTrigger({ city: City, routeName: Zh_tw, routeUid: RouteUID }).catch(() => {});
  };

  useEffect(() => {
    if (routeData) {
      dispatch(setRouteInOffcanvas(routeData));
    }
  }, [routeData]);

  return (
    <BusListStyle height={height}>
      {routes.map((route) => (
        <BusItem key={route.RouteUID} onClick={() => handleOffcanvas(route)}>
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
