import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IBusRoute, IBusRouteDetail, ShapeOfBusRoute } from 'react-app-env';

const initialState = {
  busRoutes: [] as Array<IBusRoute>,
  currentRouteInOffcanvas: [] as Array<IBusRouteDetail>,
  shapeOfBusRoute: [] as ShapeOfBusRoute,
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
    setShapeOfBusRoute: (state, { payload }: PayloadAction<ShapeOfBusRoute>) => {
      state.shapeOfBusRoute = payload;
    },
  },
});

export const {
  setBusRoutes, setRouteInOffcanvas, clearRouteInOffcanvas, setShapeOfBusRoute,
} = busRoutesSlice.actions;

export default busRoutesSlice.reducer;
