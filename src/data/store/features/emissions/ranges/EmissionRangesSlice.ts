import { createSlice } from "@reduxjs/toolkit"
import { v4 as uuid } from "uuid"
import { IndexesContainer } from "./EndpointTypes"
import { emissionRangesApi } from "./EmissionRangesClient"
import {
  AlignedIndexes,
  BusinessEntity,
  GeographicalArea,
  IdTreeNode,
  IndexOf,
  EmissionRangeState,
  EmissionFilterState,
  TimeWindow,
  EmissionDataPoint,
  VisibleData,
} from "./EmissionTypes"

const initialFilterState: EmissionFilterState = {
  selectedBusinessEntities: [],
  selectedGeographicalAreas: [],
  selectedCategories: [],
}

const initialState: EmissionRangeState = {
  alignedIndexes: {
    entities: {},
    areas: {},
    categories: {},
    areaHierarchy: [],
    entityHierarchy: [],
  },
  allPoints: [],
  visiblePoints: {
    emissionPoints: [],
  },
  overallTimeWindow: {
    start: "",
    end: "",
    step: 0,
  },
  emissionFilterState: { ...initialFilterState },
}

function extractHierarchyOf<T>(
  indexOfValues: IndexOf<T>,
  idFunc: (t: T) => number,
  parentFunc: (t: T) => number | undefined,
): IdTreeNode[] {
  if (Object.keys(indexOfValues).length === 0) {
    return []
  }

  const indexOfTreeNodes: IndexOf<IdTreeNode> = {}
  Object.values(indexOfValues).forEach((v) => {
    const id = idFunc(v)
    const node: IdTreeNode = {
      value: id,
      children: [],
    }
    indexOfTreeNodes[id] = node
  })

  const rootIds = new Set(
    Object.keys(indexOfValues).map((id) => parseInt(id, 10)),
  )
  Object.values(indexOfTreeNodes).forEach((node) => {
    const myArea = indexOfValues[node.value]
    const parentId = parentFunc(myArea)
    if (parentId) {
      const myParentNode = indexOfTreeNodes[parentId]
      myParentNode.children.push(node)
      rootIds.delete(idFunc(myArea))
    }
  })

  return Object.values(indexOfTreeNodes).filter((node) =>
    rootIds.has(node.value),
  )
}

const extractAreaHierarchy = (areas: IndexOf<GeographicalArea>): IdTreeNode[] =>
  extractHierarchyOf(
    areas,
    (area) => area.id,
    (area) => area.parent,
  )

const extractEntityHierarchy = (
  entities: IndexOf<BusinessEntity>,
): IdTreeNode[] =>
  extractHierarchyOf(
    entities,
    (entity) => entity.id,
    (entity) => entity.parent,
  )

const extractNameOfEra = (era: string | undefined) => {
  if (typeof era === "undefined") {
    return ""
  }
  switch (era.toLowerCase()) {
    case "d":
      return "Downstream"
    case "u":
      return "Upstream"
    case "o":
      return "Operation"
    default:
      return era
  }
}

const alignIndexes = (originalIndexes: IndexesContainer): AlignedIndexes => {
  const alignedBusinessEntities = Object.fromEntries(
    originalIndexes.entity.map((company) => [company.id, company]),
  )
  const alignedAreas = Object.fromEntries(
    originalIndexes.area.map((area) => [area.id, area]),
  )

  const alignedCategories = Object.fromEntries(
    originalIndexes.category
      .map((origCategory) => ({
        ...origCategory,
        era: extractNameOfEra(origCategory.era),
      }))
      .map((category) => [category.id, category]),
  )

  const areasTree = extractAreaHierarchy(alignedAreas)
  const entityTree = extractEntityHierarchy(alignedBusinessEntities)

  return {
    entities: alignedBusinessEntities,
    areas: alignedAreas,
    categories: alignedCategories,
    areaHierarchy: areasTree,
    entityHierarchy: entityTree,
  }
}

// eslint-disable-next-line no-unused-vars
const calculateTotalAmount = (
  dataPoint: EmissionDataPoint,
  overallTimeWindow: TimeWindow,
): number => {
  // TODO more accurate step usage
  const seconds =
    typeof overallTimeWindow.step === "number"
      ? overallTimeWindow.step
      : overallTimeWindow.step[0]

  const duration =
    seconds *
    (dataPoint.endTimeSlot() -
      dataPoint.startTimeSlot() -
      2 +
      dataPoint.startIntensityPercentage() +
      dataPoint.endIntensityPercentage())

  return duration * dataPoint.emissionIntensity()
}

const AREAS_OF_INTEREST = ["World region", "Continent", "Country"]
/*
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
*/

/*
const compressedPayloadToDataPoint = (
  payload: CompressedDataPoint,
  indexes: AlignedIndexes,
): DataPoint => {
  const category =
    indexes.categories[payload[CdpLayoutItem.CDP_LAYOUT_CATEGORY]]
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
    category: category.name,
    categoryId: category.id,
    company: company.name,
    location: {
      lat: area.details?.lat ?? 0,
      lon: area.details?.long ?? 0,
      country: country.name,
    },
  }
}
*/

/*
const extractFilters = (indexes: AlignedIndexes): GlobalFilterState => {
  const categories = new Set<string>()
  const companies = new Set<string>()
  const countries = new Set<string>()

  Object.values(indexes.categories)
    .filter((category) => category.era)
    .forEach((category) => categories.add(category.era!!))
  Object.values(indexes.entities)
    .filter((entity) => entity.type === "Company")
    .forEach((entity) => companies.add(entity.name))
  Object.values(indexes.areas)
    .filter((area) => area.type === "Country")
    .forEach((area) => countries.add(area.name))

  return {
    availableValues: {
      categories: Array.from(categories)
        .map((era) => extractNameOfEra(era))
        .filter((category) => category !== "")
        .sort(),
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
*/

function filterRoutine<T>(currentValue: T, filterSelectedValues: T[]): boolean {
  return (
    filterSelectedValues.length === 0 ||
    filterSelectedValues.includes(currentValue)
  )
}

const filterVisibleData = (
  dataPoints: EmissionDataPoint[],
  indexes: AlignedIndexes,
  filter: EmissionFilterState,
): VisibleData => {
  const filteredDataPoints = dataPoints
    .filter((dataPoint) => {
      const category = indexes.categories[dataPoint.categoryId()]
      return filterRoutine(
        category.era?.toLowerCase() ?? "",
        filter.selectedCategories,
      )
    })
    .filter((dataPoint) =>
      filterRoutine(
        dataPoint.businessEntityId(),
        filter.selectedBusinessEntities,
      ),
    )
    .filter((dataPoint) =>
      filterRoutine(dataPoint.geoAreaId(), filter.selectedGeographicalAreas),
    )

  /*
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
  */

  return {
    emissionPoints: filteredDataPoints,
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
        const allPoints = action.payload.data.map(
          (compressedPoint) => new EmissionDataPoint(uuid(), compressedPoint),
        )
        // const availableFilters = extractFilters(alignedIndexes)
        const visiblePoints = filterVisibleData(
          allPoints,
          alignedIndexes,
          state.emissionFilterState,
        )

        state.alignedIndexes = alignedIndexes
        state.allPoints = allPoints
        state.visiblePoints = visiblePoints
        state.overallTimeWindow = action.payload.time_range
        // state.emissionFilterState = availableFilters
      },
    )
  },
})

export default emissionsRangeSlice.reducer
