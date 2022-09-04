import { configureStore } from '@reduxjs/toolkit';
import busRoutesReducer from 'slices/busRoutesSlice';
import { busRoutesApi } from 'services/busRoutes';

export const store = configureStore({
  reducer: {
    [busRoutesApi.reducerPath]: busRoutesApi.reducer,
    busRoutes: busRoutesReducer,
  },
  middleware: (getCurrentMiddlewares) => getCurrentMiddlewares().concat(busRoutesApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
