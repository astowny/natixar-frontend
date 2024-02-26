import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch } from 'react-redux'

import { coordinateApi } from './features/coordinates/CoordinateClient'
import CoordinateSlice from './features/coordinates/CoordinateSlice'
import ClusterSlice from './features/coordinates/ClusterSlice'

export const store = configureStore({
    reducer: {
        coordinates: CoordinateSlice,
        selectedCluster: ClusterSlice,
        [coordinateApi.reducerPath]: coordinateApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(coordinateApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch 

setupListeners(store.dispatch)
