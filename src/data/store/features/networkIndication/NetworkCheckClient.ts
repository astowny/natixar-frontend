import { createApi } from "@reduxjs/toolkit/query/react"
import { backendBaseQueryFn } from "data/store/config/BackendConfigs"

export const networkCheckApi = createApi({
  reducerPath: "networkCheckApi",
  baseQuery: backendBaseQueryFn(),
  endpoints: (builder) => ({
    getNetworkInformation: builder.query<string, void>({
      query: () => ({
        url: `/health`,
        method: "GET",
        responseHandler: "text",
      }),
    }),
  }),
})

export const { useGetNetworkInformationQuery } = networkCheckApi
