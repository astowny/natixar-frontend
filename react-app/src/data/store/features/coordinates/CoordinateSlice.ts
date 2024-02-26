import { CaseReducer, PayloadAction, createSlice } from '@reduxjs/toolkit'

import { DataPoint, DateTimeRangeFilter, EmissionStorage, PerceivedData } from './Types'
import { coordinateApi } from './CoordinateClient'

const MOST_WINDOWS_OF_INTEREST = 12

let initialState: EmissionStorage = {
    wholeDataSet: {
        min_time: Date.now() - (60 * 60 * 1000),
        max_time: Date.now(),
        totalSteps: MOST_WINDOWS_OF_INTEREST,
        categories: [],
        companies: [],
        countries: [],
        data: {}
    },
    filter: {
        from: 0,
        to: MOST_WINDOWS_OF_INTEREST - 1
    },
    visibleFrame: {
        allPoints: [],
        byCompany: [],
        byCountry: []
    }
}

const produceVisibleIndexedData = (dataPoints: Array<DataPoint>): PerceivedData => {
    const byCompany = dataPoints.reduce((accumulator: any, currentPoint: DataPoint) => {
        const currentCompany = currentPoint.company
        if (!accumulator[currentCompany]) {
            accumulator[currentCompany] = {};
        }

        const currCategory = currentPoint.category.toLowerCase()
        if (!accumulator[currentCompany][currCategory]) {
            accumulator[currentCompany][currCategory] = 0;
        }
        accumulator[currentCompany][currCategory] += currentPoint.emission_amount;
        accumulator[currentCompany]["company"] = currentCompany
        return accumulator;
    }, {});

    const byCountry = dataPoints.reduce((accumulator: any, currentPoint: DataPoint) => {
        const currentCountry = currentPoint.location.country
        if (!accumulator[currentCountry]) {
            accumulator[currentCountry] = {};
        }

        const currCategory = currentPoint.category.toLowerCase()
        if (!accumulator[currentCountry][currCategory]) {
            accumulator[currentCountry][currCategory] = 0;
        }
        accumulator[currentCountry][currCategory] += currentPoint.emission_amount;
        accumulator[currentCountry]["country"] = currentCountry
        return accumulator;
    }, {});

    return {
        allPoints: dataPoints,
        byCompany: Object.values(byCompany),
        byCountry: Object.values(byCountry)
    }
}

const extractFilterValues = (
    state: EmissionStorage
) => {
    const categories = new Set<string>()
    const companies = new Set<string>()
    const countries = new Set<string>()

    Object.values(state.wholeDataSet.data).forEach(dataPoints => {
        dataPoints.forEach(dataPoint => {
            const { company, category } = dataPoint
            const country = dataPoint.location.country
            companies.add(company)
            categories.add(category)
            countries.add(country)
        })
    })

    state.wholeDataSet.categories = Array.from(categories).map(category => category.toLowerCase())
    state.wholeDataSet.companies = Array.from(companies)
    state.wholeDataSet.countries = Array.from(countries)
}

const extractVisibleDataPoints = (
    state: EmissionStorage,
    dateFilter: DateTimeRangeFilter = state.filter
) => {
    const allDates = Object.keys(state.wholeDataSet.data)
    let { from, to } = dateFilter

    const datesOfInterest = allDates.slice(from, to)

    const filteredDataPoints = datesOfInterest.flatMap(timeWindowMark => {
        return state.wholeDataSet.data[timeWindowMark]
    })

    state.visibleFrame = produceVisibleIndexedData(filteredDataPoints)
}

const changeVisibleDates: CaseReducer<EmissionStorage, PayloadAction<DateTimeRangeFilter>> = (state, action) => {
    state.filter = action.payload
    extractVisibleDataPoints(state)
}

export const coordinateSlice = createSlice({
    name: 'coordinates',
    initialState,
    reducers: {
        changeVisibileDates: changeVisibleDates
    },
    extraReducers: (builder) => {
        builder.addMatcher(coordinateApi.endpoints.getRandomCoordinates.matchFulfilled, (state, action) => {
            const newData = Object.assign({}, state.wholeDataSet.data, action.payload.data)
            const timestampsOfInterest = Object.keys(newData).sort().slice(-MOST_WINDOWS_OF_INTEREST)
            state.wholeDataSet.data = Object.fromEntries(
                timestampsOfInterest.map((timeMoment) => [timeMoment, newData[timeMoment]])
            )
            state.wholeDataSet.min_time = parseInt(timestampsOfInterest[0], 10)
            state.wholeDataSet.max_time = parseInt(timestampsOfInterest[timestampsOfInterest.length - 1], 10)
            extractFilterValues(state)
            extractVisibleDataPoints(state)
        })
    }
})

export const { changeVisibileDates } = coordinateSlice.actions
export default coordinateSlice.reducer