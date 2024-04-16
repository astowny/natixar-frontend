import { fetchBaseQuery } from "@reduxjs/toolkit/query"

const backendBaseQuery = () =>
  fetchBaseQuery({ baseUrl: import.meta.env.VITE_NATIXAR_BACKEND_URL })

export const backendBaseQueryFn = backendBaseQuery
