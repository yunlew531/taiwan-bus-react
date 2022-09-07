import { configureStore } from '@reduxjs/toolkit';
import busRoutesReducer from 'slices/busRoutesSlice';
import { busApi } from 'services/bus';

export const store = configureStore({
  reducer: {
    [busApi.reducerPath]: busApi.reducer,
    busRoutes: busRoutesReducer,
  },
  middleware: (getCurrentMiddlewares) => getCurrentMiddlewares()
    .concat(busApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
