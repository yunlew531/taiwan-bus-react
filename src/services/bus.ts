import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import type {
  IBusStopArriveTime, IBusRoute, IBusRouteDetail, IShapeOfBusRoute,
} from 'react-app-env';

interface IGetRouteData {
  city: string;
  routeName: string;
  routeUid: string;
}

export const busApi = createApi({
  reducerPath: 'busApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_TDX_URL,
    prepareHeaders: (headers) => {
      headers.set('authorization', `Bearer ${Cookies.get('taiwanBus') as string}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getRoutesByCity: builder.query<Array<IBusRoute>, string>({
      query: (city) => `Route/City/${city}`,
    }),
    getRouteByRouteUid: builder.query<Array<IBusRouteDetail>, IGetRouteData>({
      query: ({ city, routeName, routeUid }) => `DisplayStopOfRoute/City/${city}/${routeName}?$filter=contains(RouteUID, '${routeUid}')`,
    }),
    getBusArriveTimeByRouteUid: builder.query<Array<IBusStopArriveTime>, IGetRouteData>({
      query: ({ city, routeName, routeUid }) => `EstimatedTimeOfArrival/City/${city}/${routeName}?$filter=contains(RouteUID, '${routeUid}')`,
    }),
    getSharpOfBusRouteByRouteUid: builder.query<Array<IShapeOfBusRoute>, IGetRouteData>({
      query: ({ city, routeName, routeUid }) => `Shape/City/${city}/${routeName}?$filter=contains(RouteUID, '${routeUid}')`,
    }),
  }),
});

export const {
  useGetRoutesByCityQuery,
  useLazyGetRoutesByCityQuery,
  useLazyGetRouteByRouteUidQuery,
  useLazyGetBusArriveTimeByRouteUidQuery,
  useLazyGetSharpOfBusRouteByRouteUidQuery,
} = busApi;
