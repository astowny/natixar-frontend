import { createApi } from "@reduxjs/toolkit/query/react"
import { backendBaseQueryFn } from "data/store/config/BackendConfigs"
import { DataSet } from "./Types"

export const coordinateApi = createApi({
  reducerPath: "coordinateApi",
  baseQuery: backendBaseQueryFn(),
  endpoints: (builder) => ({
    getRandomCoordinates: builder.query<DataSet, void>({
      query: () => ({
        url: `/emissionsByCoordinates`,
        method: "GET",
      }),
    }),
  }),
})

export const {
  useGetRandomCoordinatesQuery,
  useLazyGetRandomCoordinatesQuery,
} = coordinateApi
