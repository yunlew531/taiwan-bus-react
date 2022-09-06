import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IBusRoute, IBusRouteDetail } from 'react-app-env';

const initialState = {
  busRoutes: [] as Array<IBusRoute>,
  currentRouteInOffcanvas: [] as Array<IBusRouteDetail>,
};

export const busRoutesSlice = createSlice({
  name: 'busRoutes',
  initialState,
  reducers: {
    setBusRoutes: (state, { payload }: PayloadAction<Array<IBusRoute>>) => {
      state.busRoutes = payload;
    },
    clearBusRoutes: (state) => { state.busRoutes = []; },
    setRouteInOffcanvas: (state, { payload }: PayloadAction<Array<IBusRouteDetail>>) => {
      state.currentRouteInOffcanvas = payload;
    },
    clearRouteInOffcanvas: (state) => { state.currentRouteInOffcanvas = []; },
  },
});

export const { setBusRoutes, setRouteInOffcanvas, clearRouteInOffcanvas } = busRoutesSlice.actions;

export default busRoutesSlice.reducer;
