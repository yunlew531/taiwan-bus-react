/// <reference types="react-scripts" />

import theme from 'styleSheets/theme';

type ThemeProps = { theme?: typeof theme };

type StationStatus = '過站' | '進站中' | '稍後進站' | '10分';

interface IBusRoute {
  RouteUID: string;
  RouteID: string;
  RouteName: {
    En: string;
    Zh_tw: string;
  }
  Operators: Array<{
    OperatorName: {
      Zh_tw: string;
      En: string;
    }
  }>
  SubRoutes: Array<{
    Headsign: string;
    Direction: 0 | 1;
  }>
  DepartureStopNameZh: string;
  DepartureStopNameEn: string
  DestinationStopNameZh: string;
  DestinationStopNameEn: string;
  RouteMapImageUrl: 'http://ebus.tycg.gov.tw/cms/api/route/130/map/1364/image';
  City: string;
  CityCode: string;
  UpdateTime: string;
}

type PositionLatLon = [number, number];

interface IStop {
  Estimates: Array<IEstimate>;
  EstimateTime?: number;
  StopUID: string;
  StopID: string;
  StopName: {
    Zh_tw: string;
    En: string;
  }
  StopBoarding: 0
  StopSequence: 1
  StopPosition: {
    PositionLon: number;
    PositionLat: number;
    GeoHash: string;
  }
  StationID: string;
}

interface IBusRouteDetail {
  RouteUID: string;
  RouteID: string;
  RouteName: {
    Zh_tw: string;
    En: string;
  }
  Direction: 0 | 1;
  Stops: Array<IStop>;
}

interface IBusStopArriveTime {
  PlateNumb: string;
  StopUID: string;
  StopID: string;
  StopName: {
    Zh_tw: string;
    En: string;
  },
  RouteUID: string;
  RouteID: string;
  RouteName: {
    Zh_tw: string;
    En: string;
  },
  SubRouteUID: string;
  SubRouteID: string;
  SubRouteName: {
    Zh_tw: string;
    En: string;
  },
  Direction: 0 | 1;
  EstimateTime: number;
  StopSequence: string;
  StopStatus: number;
  NextBusTime: string;
  Estimates: Array<IEstimate>;
  SrcUpdateTime: string;
  UpdateTime: string;
}

interface IEstimate {
  PlateNumb?: string;
  EstimateTime: number;
  IsLastBus?: boolean;
}

interface IAccessToken {
  access_token: string;
  expires_in: number;
}

interface IShapeOfBusRouteRes {
  RouteUID: string;
  RouteID: string;
  RouteName: {
    Zh_tw: string;
    En: string;
  },
  SubRouteUID: string;
  SubRouteID: string;
  SubRouteName: {
    Zh_tw: string;
    En: string;
  },
  Direction: 0 | 1;
  Geometry: string;
  EncodedPolyline: string;
  UpdateTime: string;
  VersionID: number;
}

type ShapeOfBusRoute = [Array<[number, number]>?, Array<[number, number]>?];
