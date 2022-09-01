import React from 'react';
import styled from '@emotion/styled';
import type { ThemeProps } from 'react-app-env';

const BusListStyle = styled.ul<{ height: string | undefined }>`
  height: ${({ height }) => (height ? `${height}px` : 'auto')};
  overflow-y: scroll;
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
  .routeNum {
    font-size: ${({ theme: { fontSizes: { fs_1 } } }) => fs_1};
    font-weight: 700;
    margin-bottom: 5px;
    text-align: left;
  }
  .routeName {
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

interface IRoute {
  routeNum: number;
  route: string;
}

interface IBusList {
  city?: string | null;
  routes: Array<IRoute>;
  height?: string;
}

// eslint-disable-next-line arrow-body-style
const BusList: React.FC<IBusList> = ({ city, routes, height }) => {
  return (
    <BusListStyle height={height}>
      {routes.map((route) => (
        <BusItem key={route.routeNum}>
          <div>
            <p className="routeNum">{route.routeNum}</p>
            <p className="routeName">{route.route}</p>
          </div>
          <div>
            <span className="material-icons-outlined favorite">favorite_border</span>
            {/* <span className="material-icons-outlined favorite">favorite</span> */}
            {city && <p className="cityName">{city}</p>}
          </div>
        </BusItem>
      ))}
    </BusListStyle>
  );
};

BusList.defaultProps = {
  city: null,
  height: '',
};

export default BusList;
