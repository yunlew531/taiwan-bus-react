/// <reference types="react-scripts" />

import theme from 'styleSheets/theme';

type ThemeProps = { theme?: typeof theme };

type StationStatus = '過站' | '進站中' | '即將進站' | '10分';

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
    Direction: number;
  }>
  DepartureStopNameZh: string;
  DepartureStopNameEn: string
  DestinationStopNameZh: string;
  DestinationStopNameEn: string;
  RouteMapImageUrl: 'http://ebus.tycg.gov.tw/cms/api/route/130/map/1364/image',
  City: string;
  CityCode: string;
  UpdateTime: string;
}

interface IBusRouteDetail {
  RouteUID: string;
  RouteID: string;
  RouteName: {
    Zh_tw: string;
    En: string;
  }
  Direction: 0 | 1;
  Stops: Array<{
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
  }>
}
