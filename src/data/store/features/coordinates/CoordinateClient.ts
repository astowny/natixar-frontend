import { createApi } from "@reduxjs/toolkit/query/react"
import { backendBaseQuery } from "data/store/config/BackendConfigs"
import { DataSet } from "./Types"

export const coordinateApi = createApi({
  reducerPath: "coordinateApi",
  baseQuery: backendBaseQuery(),
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
