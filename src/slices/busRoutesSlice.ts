import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  IBusRoute, IBusRouteDetail, ShapeOfBusRoute, BusNearStop, IFavoRoutes,
} from 'react-app-env';

const initialState = {
  busRoutes: [] as Array<IBusRoute>,
  currentRouteInOffcanvas: [] as Array<IBusRouteDetail>,
  shapeOfBusRoute: [] as ShapeOfBusRoute,
  busNearStop: [[], []] as BusNearStop,
  favoRoutes: JSON.parse(localStorage.getItem('favoRoutes') || '{}') as IFavoRoutes,
};

export const busRoutesSlice = createSlice({
  name: 'busRoutes',
  initialState,
  reducers: {
    setBusRoutes: (state, { payload }: PayloadAction<Array<IBusRoute>>) => {
      state.busRoutes = payload;
    },
    setRouteInOffcanvas: (state, { payload }: PayloadAction<Array<IBusRouteDetail>>) => {
      state.currentRouteInOffcanvas = payload;
    },
    setShapeOfBusRoute: (state, { payload }: PayloadAction<ShapeOfBusRoute>) => {
      state.shapeOfBusRoute = payload;
    },
    setBusNearStop: (state, { payload }: PayloadAction<BusNearStop>) => {
      state.busNearStop = payload;
    },
    setFavoRoutes: (state, { payload }: PayloadAction<IFavoRoutes>) => {
      state.favoRoutes = payload;
    },
  },
});

export const {
  setBusRoutes, setRouteInOffcanvas, setShapeOfBusRoute, setBusNearStop, setFavoRoutes,
} = busRoutesSlice.actions;

export default busRoutesSlice.reducer;
