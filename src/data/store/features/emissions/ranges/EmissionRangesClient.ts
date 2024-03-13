import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "data/store/config/BackendConfigs"
import { EmissionRangesPayload, EmissionRangesRequests } from "./EndpointTypes"

export const emissionRangesApi = createApi({
  reducerPath: "emissionRangesApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getEmissionRanges: builder.query<
      EmissionRangesPayload,
      EmissionRangesRequests
    >({
      query: () => ({
        url: `/api/v0/data/ranges`,
        method: "GET",
        // data: JSON.stringify(requests),
      }),
      transformResponse: (
        payload: EmissionRangesPayload[],
      ): EmissionRangesPayload => payload[0],
    }),
  }),
})

export const { useGetEmissionRangesQuery, useLazyGetEmissionRangesQuery } =
  emissionRangesApi
