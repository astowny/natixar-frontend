import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { useDispatch } from "react-redux"

import CoordinateSlice from "./features/coordinates/CoordinateSlice"
import EmissionRangesSlice from "./features/emissions/ranges/EmissionRangesSlice"
import ClusterSlice from "./features/coordinates/ClusterSlice"
import UnknownCodeMappingsSlice from "./features/codemappings/UnknownCodeMappingsSlice"
import MappingToEditSlice from "./features/codemappings/MappingEditSlice"
import { coordinateApi } from "./features/coordinates/CoordinateClient"
import { emissionRangesApi } from "./features/emissions/ranges/EmissionRangesClient"
import { unknownMappingsApi } from "./features/codemappings/UnknownCodeMappingsClient"
import { networkCheckApi } from "./features/networkIndication/NetworkCheckClient"
import { fileUploadApi } from "./features/fileupload/FileUploadClient"
import { reportGenerationApi } from "./features/reports/ReportGenerationClient"

export const store = configureStore({
  reducer: {
    coordinates: CoordinateSlice,
    emissionRanges: EmissionRangesSlice,
    unknownCodeMappings: UnknownCodeMappingsSlice,
    mappingToEdit: MappingToEditSlice,
    selectedCluster: ClusterSlice,
    [coordinateApi.reducerPath]: coordinateApi.reducer,
    [emissionRangesApi.reducerPath]: emissionRangesApi.reducer,
    [unknownMappingsApi.reducerPath]: unknownMappingsApi.reducer,
    [networkCheckApi.reducerPath]: networkCheckApi.reducer,
    [fileUploadApi.reducerPath]: fileUploadApi.reducer,
    [reportGenerationApi.reducerPath]: reportGenerationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      coordinateApi.middleware,
      emissionRangesApi.middleware,
      unknownMappingsApi.middleware,
      networkCheckApi.middleware,
      fileUploadApi.middleware,
      reportGenerationApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

setupListeners(store.dispatch)
