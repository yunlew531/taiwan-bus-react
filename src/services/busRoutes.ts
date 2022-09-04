import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IBusRoute } from 'react-app-env';

export const busRoutesApi = createApi({
  reducerPath: 'busRoutesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://tdx.transportdata.tw/api/basic/v2/Bus/' }),
  endpoints: (builder) => ({
    getRoutesByCity: builder.query<Array<IBusRoute>, string>({
      query: (city) => `Route/City/${city}`,
    }),
  }),
});

export const { useGetRoutesByCityQuery } = busRoutesApi;