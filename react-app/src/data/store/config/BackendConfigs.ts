import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const backendBaseQuery = () => {
    return fetchBaseQuery({ baseUrl: import.meta.env.VITE_NATIXAR_BACKEND_URL })
}

export const backendBaseQueryFn = backendBaseQuery