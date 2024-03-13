import { createSlice } from "@reduxjs/toolkit"
import { v4 as uuid } from "uuid"
import {
  DataPoint,
  GlobalEmissionFilter,
  GlobalFilterState,
  PerceivedData,
} from "../../coordinates/Types"
import { EmissionRangeState, IndexesContainer } from "./EndpointTypes"
import { emissionRangesApi } from "./EmissionRangesClient"
import {
  AlignedIndexes,
  BusinessEntity,
  CdpLayoutItem,
  CompressedDataPoint,
  GeographicalArea,
} from "./Types"

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

const initialState: EmissionRangeState = {
  alignedIndexes: {
    entities: {},
    areas: {},
    categories: {},
  },
  allPoints: [],
  visibleFrame: {
    allPoints: [],
    byCompany: [],
    byCountry: [],
  },
  globalFilter: { ...initialFilterState },
}

const alignIndexes = (originalIndexes: IndexesContainer): AlignedIndexes => {
  const alignedCompanyIndexes = Object.fromEntries(
    originalIndexes.entity.map((company) => [company.id, company]),
  )
  const alignedAreas = Object.fromEntries(
    originalIndexes.area.map((area) => [area.id, area]),
  )

  const alignedCategories = Object.fromEntries(
    originalIndexes.category.map((category) => [category.id, category]),
  )

  return {
    entities: alignedCompanyIndexes,
    areas: alignedAreas,
    categories: alignedCategories,
  }
}

const calculateTotalAmount = (payload: CompressedDataPoint): number => {
  const durationInFullTimeSlots =
    payload[CdpLayoutItem.CDP_LAYOUT_END] -
    payload[CdpLayoutItem.CDP_LAYOUT_START] -
    2 +
    payload[CdpLayoutItem.CDP_LAYOUT_START_PERCENTAGE] +
    payload[CdpLayoutItem.CDP_LAYOUT_END_PERCENTAGE]

  return durationInFullTimeSlots * payload[CdpLayoutItem.CDP_LAYOUT_INTENSITY]
}

const AREAS_OF_INTEREST = ["World region", "Continent", "Country"]
const detectCountry = (
  originalArea: GeographicalArea,
  indexes: AlignedIndexes,
): GeographicalArea => {
  let area = originalArea
  while (
    area.parent &&
    indexes.areas[area.parent] &&
    !AREAS_OF_INTEREST.includes(area.type)
  ) {
    area = indexes.areas[area.parent]
  }
  return area
}

const detectCompany = (
  originalEntity: BusinessEntity,
  indexes: AlignedIndexes,
): BusinessEntity => {
  let entity = originalEntity
  while (
    entity.parent &&
    indexes.entities[entity.parent] &&
    entity.type !== "Company"
  ) {
    entity = indexes.entities[entity.parent]
  }
  return entity
}

const compressedPayloadToDataPoint = (
  payload: CompressedDataPoint,
  indexes: AlignedIndexes,
): DataPoint => {
  const categoryName =
    indexes.categories[payload[CdpLayoutItem.CDP_LAYOUT_CATEGORY]].name
  const company = detectCompany(
    indexes.entities[payload[CdpLayoutItem.CDP_LAYOUT_ENTITY]],
    indexes,
  )
  const area = indexes.areas[payload[CdpLayoutItem.CDP_LAYOUT_AREA]]
  const country = detectCountry(area, indexes)
  return {
    id: uuid(),
    time: payload[CdpLayoutItem.CDP_LAYOUT_START],
    emission_amount: calculateTotalAmount(payload),
    category: categoryName,
    company: company.name,
    location: {
      lat: area.details?.lat ?? 0,
      lon: area.details?.long ?? 0,
      country: country.name,
    },
  }
}

const extractFilters = (indexes: AlignedIndexes): GlobalFilterState => {
  const categories = new Set<string>()
  const companies = new Set<string>()
  const countries = new Set<string>()

  Object.values(indexes.categories)
    .filter(
      (category) =>
        !category.parent ||
        ["Upstream", "Downstream", "Operation"].includes(category.name),
    )
    .forEach((category) => categories.add(category.name))
  Object.values(indexes.entities)
    .filter((entity) => entity.type === "Company")
    .forEach((entity) => companies.add(entity.name))
  Object.values(indexes.areas)
    .filter((area) => area.type === "Country")
    .forEach((area) => countries.add(area.name))

  return {
    availableValues: {
      categories: Array.from(categories).sort(),
      companies: Array.from(companies).sort(),
      countries: Array.from(countries).sort(),
      timeRange: { from: 0, to: 0 },
    },
    selectedValues: {
      categories: [],
      companies: [],
      countries: [],
      timeRange: { from: 0, to: 0 },
    },
  }
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

export const emissionsRangeSlice = createSlice({
  name: "emissionRanges",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      emissionRangesApi.endpoints.getEmissionRanges.matchFulfilled,
      (state, action) => {
        const alignedIndexes = alignIndexes(action.payload.indexes)
        const allPoints = action.payload.data.map((compressedPoint) =>
          compressedPayloadToDataPoint(compressedPoint, alignedIndexes),
        )
        const availableFilters = extractFilters(alignedIndexes)
        const visiblePoints = filterVisibleData(
          allPoints,
          state.globalFilter.selectedValues,
        )

        state.alignedIndexes = alignedIndexes
        state.allPoints = allPoints
        state.visibleFrame = visiblePoints
        state.globalFilter = availableFilters
      },
    )
  },
})

export default emissionsRangeSlice.reducer
