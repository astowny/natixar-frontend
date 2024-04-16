import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit"

import _ from "lodash"
import {
  DataPoint,
  EmissionStorage,
  GlobalEmissionFilter,
  GlobalFilterState,
  PerceivedData,
} from "./Types"
import { coordinateApi } from "./CoordinateClient"

const MOST_WINDOWS_OF_INTEREST = 12

const initialFilterTemplate: GlobalEmissionFilter = {
  countries: [],
  companies: [],
  categories: [],
  timeRange: {
    from: 0,
    to: Number.MAX_SAFE_INTEGER,
  },
}

const initialFilterState: GlobalFilterState = {
  availableValues: { ...initialFilterTemplate },
  selectedValues: { ...initialFilterTemplate },
}

const initialState: EmissionStorage = {
  wholeDataSet: {
    partitionsByTime: {},
  },
  visibleFrame: {
    allPoints: [],
    byCompany: [],
    byCountry: [],
  },
  globalFilter: { ...initialFilterState },
}

const stringFilterRoutine = (
  currentValue: string,
  filterSelectedValues: string[],
): boolean =>
  filterSelectedValues.length === 0 ||
  filterSelectedValues.includes(currentValue)

const filterVisibleData = (
  dataPoints: Array<DataPoint>,
  filter: GlobalEmissionFilter,
): PerceivedData => {
  const filteredDataPoints = dataPoints
    .filter((dataPoint) =>
      stringFilterRoutine(dataPoint.category.toLowerCase(), filter.categories),
    )
    .filter((dataPoint) =>
      stringFilterRoutine(dataPoint.company, filter.companies),
    )
    .filter((dataPoint) =>
      stringFilterRoutine(dataPoint.location.country, filter.countries),
    )

  const byCompany = filteredDataPoints.reduce(
    (accumulator: any, currentPoint: DataPoint) => {
      const currentCompany = currentPoint.company
      if (!accumulator[currentCompany]) {
        accumulator[currentCompany] = {}
      }
      const accumulatorForCompany = accumulator[currentCompany]
      if (!accumulatorForCompany.emissionsByCategory) {
        accumulatorForCompany.emissionsByCategory = {}
      }

      const currCategory = currentPoint.category.toLowerCase()
      if (!accumulatorForCompany.emissionsByCategory[currCategory]) {
        accumulatorForCompany.emissionsByCategory[currCategory] = 0
      }

      accumulatorForCompany.company = currentCompany
      accumulatorForCompany.emissionsByCategory[currCategory] +=
        currentPoint.emission_amount

      return accumulator
    },
    {},
  )

  const byCountry = filteredDataPoints.reduce(
    (accumulator: any, currentPoint: DataPoint) => {
      const currentCountry = currentPoint.location.country
      if (!accumulator[currentCountry]) {
        accumulator[currentCountry] = {}
      }

      const accumulatorForCountry = accumulator[currentCountry]
      if (!accumulatorForCountry.emissionsByCategory) {
        accumulatorForCountry.emissionsByCategory = {}
      }

      const currCategory = currentPoint.category.toLowerCase()
      if (!accumulatorForCountry.emissionsByCategory[currCategory]) {
        accumulatorForCountry.emissionsByCategory[currCategory] = 0
      }

      accumulatorForCountry.country = currentCountry
      accumulatorForCountry.emissionsByCategory[currCategory] +=
        currentPoint.emission_amount

      return accumulator
    },
    {},
  )

  return {
    allPoints: filteredDataPoints,
    byCompany: Object.values(byCompany),
    byCountry: Object.values(byCountry),
  }
}

const extractVisibleDataPoints = (state: EmissionStorage) => {
  const allPartitions = state.wholeDataSet.partitionsByTime
  const allDates = Object.keys(allPartitions)
  const { from, to } = state.globalFilter.selectedValues.timeRange

  const datesOfInterest = allDates.filter((dateStr) => {
    const timestampFromPartition = parseInt(dateStr, 10)
    return _.inRange(timestampFromPartition, from, to)
  })

  const filteredDataPoints = datesOfInterest.flatMap(
    (timeWindowMark) => allPartitions[timeWindowMark],
  )

  state.visibleFrame = filterVisibleData(
    filteredDataPoints,
    state.globalFilter.selectedValues,
  )
}

const extractFilterAvailableValues = (state: EmissionStorage) => {
  const dataPartitions = state.wholeDataSet.partitionsByTime
  if (Object.keys(dataPartitions).length <= 0) {
    state.globalFilter = { ...initialFilterState }
    return
  }

  const categories = new Set<string>()
  const companies = new Set<string>()
  const countries = new Set<string>()

  Object.keys(dataPartitions)
    .flatMap((timeWindowMark) => dataPartitions[timeWindowMark])
    .forEach((dataPoint) => {
      const { company, category } = dataPoint
      const { country } = dataPoint.location
      companies.add(company)
      categories.add(category)
      countries.add(country)
    })

  state.globalFilter.availableValues.categories = Array.from(categories)
    .map((category) => category.toLowerCase())
    .sort()
  state.globalFilter.availableValues.companies = Array.from(companies).sort()
  state.globalFilter.availableValues.countries = Array.from(countries).sort()
}

const setSelectedCountriesReducer: CaseReducer<
  EmissionStorage,
  PayloadAction<string[]>
> = (state, action) => {
  state.globalFilter.selectedValues.countries = [...action.payload]
  extractVisibleDataPoints(state)
}

const setSelectedCompaniesReducer: CaseReducer<
  EmissionStorage,
  PayloadAction<string[]>
> = (state, action) => {
  state.globalFilter.selectedValues.companies = [...action.payload]
  extractVisibleDataPoints(state)
}

const setSelectedCategoriesReducer: CaseReducer<
  EmissionStorage,
  PayloadAction<string[]>
> = (state, action) => {
  state.globalFilter.selectedValues.categories = [...action.payload].map(
    (category) => category.toLowerCase(),
  )
  extractVisibleDataPoints(state)
}

const clearSelectedFilterReducer: CaseReducer<
  EmissionStorage,
  PayloadAction
> = (state) => {
  state.globalFilter.selectedValues = { ...initialFilterTemplate }
  extractVisibleDataPoints(state)
}

export const coordinateSlice = createSlice({
  name: "coordinates",
  initialState,
  reducers: {
    setSelectedCountries: setSelectedCountriesReducer,
    setSelectedCompanies: setSelectedCompaniesReducer,
    setSelectedCategories: setSelectedCategoriesReducer,
    clearFilter: clearSelectedFilterReducer,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      coordinateApi.endpoints.getRandomCoordinates.matchFulfilled,
      (state, action) => {
        // Joining time partitions
        const newDataPartitionsByTime = {
          ...state.wholeDataSet.partitionsByTime,
          ...action.payload.partitionsByTime,
        }
        const timestampsOfInterest = Object.keys(newDataPartitionsByTime)
          .toSorted()
          .slice(-MOST_WINDOWS_OF_INTEREST)
        state.wholeDataSet.partitionsByTime = Object.fromEntries(
          timestampsOfInterest.map((timeMoment) => [
            timeMoment,
            newDataPartitionsByTime[timeMoment],
          ]),
        )
        extractFilterAvailableValues(state)
        extractVisibleDataPoints(state)
      },
    )
  },
})

export const {
  setSelectedCountries,
  setSelectedCompanies,
  setSelectedCategories,
  clearFilter,
} = coordinateSlice.actions
export default coordinateSlice.reducer
