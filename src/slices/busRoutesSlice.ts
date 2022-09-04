import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IBusRoute } from 'react-app-env';

const initialState = {
  busRoutes: [] as Array<IBusRoute>,
};

export const busRoutesSlice = createSlice({
  name: 'busRoutes',
  initialState,
  reducers: {
    setBusRoutes: (state, { payload }: PayloadAction<Array<IBusRoute>>) => {
      state.busRoutes = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setBusRoutes } = busRoutesSlice.actions;

export default busRoutesSlice.reducer;
