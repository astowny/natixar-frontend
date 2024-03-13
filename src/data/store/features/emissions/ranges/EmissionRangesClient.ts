import { createApi } from "@reduxjs/toolkit/query/react"
import { backendBaseQueryFn } from "data/store/config/BackendConfigs"
import { EmissionRangesPayload } from "./EndpointTypes"

export const emissionRangesApi = createApi({
  reducerPath: "emissionRangesApi",
  baseQuery: backendBaseQueryFn(),
  endpoints: (builder) => ({
    getEmissionRanges: builder.query<EmissionRangesPayload, void>({
      query: () => ({
        url: `/data/ranges`,
        method: "GET",
      }),
    }),
  }),
})

export const { useGetEmissionRangesQuery, useLazyGetEmissionRangesQuery } =
  emissionRangesApi
