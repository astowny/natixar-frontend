import { createApi } from "@reduxjs/toolkit/query/react"
import { backupBackendBaseQuery } from "data/store/config/BackendConfigs"

export const fileUploadApi = createApi({
  reducerPath: "fileUpload",
  baseQuery: backupBackendBaseQuery(),
  endpoints: (builder) => ({
    sendFiles: builder.mutation<string, string>({
      query: (payload) => ({
        url: "/files",
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "text/plain; charset=UTF-8",
        },
      }),
    }),
  }),
})

export const { useSendFilesMutation } = fileUploadApi
