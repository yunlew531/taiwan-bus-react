import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IBusRoute, IBusRouteDetail } from 'react-app-env';

interface IGetRouteData {
  city: string;
  routeName: string;
  routeUid: string;
}

export const busApi = createApi({
  reducerPath: 'busApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://tdx.transportdata.tw/api/basic/v2/Bus/' }),
  endpoints: (builder) => ({
    getRoutesByCity: builder.query<Array<IBusRoute>, string>({
      query: (city) => `Route/City/${city}`,
    }),
    getRouteByRouteUid: builder.query<Array<IBusRouteDetail>, IGetRouteData>({
      query: ({ city, routeName, routeUid }) => `DisplayStopOfRoute/City/${city}/${routeName}?$filter=contains(RouteUID, '${routeUid}')`,
    }),
  }),
});

export const {
  useGetRoutesByCityQuery,
  useLazyGetRoutesByCityQuery,
  useLazyGetRouteByRouteUidQuery,
} = busApi;
