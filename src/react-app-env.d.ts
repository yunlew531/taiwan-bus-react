/// <reference types="react-scripts" />

import theme from 'styleSheets/theme';

type ThemeProps = { theme?: typeof theme };

type StationStatus = '過站' | '進站中' | '即將進站' | '10分';

interface IBusRoute {
  RouteUID: string;
  RouteID: string;
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
