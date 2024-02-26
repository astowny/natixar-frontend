import { createApi } from '@reduxjs/toolkit/query/react'
import { DataSet } from './Types'
import { backendBaseQueryFn } from 'data/store/config/BackendConfigs'

export const coordinateApi = createApi({
    reducerPath: 'coordinateApi',
    baseQuery: backendBaseQueryFn(),
    endpoints: (builder) => ({
        getRandomCoordinates: builder.query<DataSet, void>({
            query: () => ({
                url: `/random_data`,
                method: 'GET',
            })
        }),
    }),
})

export const {
    useGetRandomCoordinatesQuery,
    useLazyGetRandomCoordinatesQuery,
} = coordinateApi
