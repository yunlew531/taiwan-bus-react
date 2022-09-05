import { configureStore } from '@reduxjs/toolkit';
import busRoutesReducer from 'slices/busRoutesSlice';
import { busApi } from 'services/bus';

export const store = configureStore({
  reducer: {
    [busApi.reducerPath]: busApi.reducer,
    busRoutes: busRoutesReducer,
  },
  middleware: (getCurrentMiddlewares) => getCurrentMiddlewares().concat(busApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
