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
  Operators?: Array<{
    OperatorName: {
      Zh_tw: string;
      En: string;
    }
  }>
  SubRoutes?: Array<{
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
  isFavorite?: boolean;
}

type BusRoutes = Array<IBusRoute>;
type PositionLatLon = [number, number];

interface IPositionLatLonObj {
  latitude: number;
  longitude: number;
}

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
  City: string;
  isFavorite?: boolean;
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

type BusNearStop = [Array<IBusNearStop>?, Array<IBusNearStop>?];

interface IGetRouteData {
  city: string;
  routeName: string;
  routeUid: string;
}

interface IBusNearStop {
  PlateNumb: string;
  OperatorID: number;
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
  Direction: number;
  StopUID: string;
  StopID: string;
  StopName: {
    Zh_tw: string;
    En: string;
  },
  StopSequence: number;
  DutyStatus: number;
  BusStatus: number;
  GPSTime: string;
  SrcUpdateTime: string;
  UpdateTime: string;
}

interface IFavoRoute {
  zhName: string;
  engName: string;
  routeUid: string;
  city: string;
  zhCity: string;
  departureStop: string;
  destinationStop: string;
}

interface IFavoStop {
  routeUid: string;
  routeName: string;
  destinationStop: string;
  destinationStop: string;
  zhCity: string;
  city: string;
  stopUid: string;
  stopName: string;
  position: IStationPosition;
}

interface IFavoRoutes {
  [key: string]: IFavoRoute | null;
}

interface IFavoStops {
  [key: string]: IFavoStop | null;
}

interface ICityCounty {
  CityName: string;
  CityEngName: string;
  AreaList: Array<ICounty>;
}

interface ICounty {
  ZipCode: string;
  AreaName: string;
  AreaEngName: string;
}

interface IStationPosition {
  PositionLon?: number;
  PositionLat?: number;
  GeoHash?: string;
}

interface IStopInStation {
  RouteUID: string;
  RouteID: string;
  RouteName: {
    Zh_tw: string;
    En: string;
  };
  StopUID?: string;
  StopID?: string;
  StopName?: {
    Zh_tw: string;
    En: string;
  }
  DepartureStopNameZh?: string;
  DestinationStopNameZh?: string;
  isFavorite: boolean;
}

interface IStation {
  StationUID: string;
  StationID: string;
  StationName: {
    Zh_tw: string;
  },
  StationAddress: string;
  StationPosition: IStationPosition;
  Stops: Array<IStopInStation>;
  LocationCityCode: string;
  Bearing: string;
  UpdateTime: string;
  VersionID: string;
  distance?: number;
}

interface IGetStationData {
  city: string;
  stationName?: string;
}

interface ITown {
  type: string;
  properties: {
    town: string;
    county: string;
    town_id: number;
    county_id: number;
    area: number;
    sort: number;
    show_id: string;
  },
  geometry: {
    type: string;
    coordinates: [[PositionLatLon[]]]
  }
  id: string;
}

interface ITwTownsLatLon {
  type: string;
  link: string;
  data_time: number;
  data_source: string;
  description: string;
  features: Array<ITown>;
}
