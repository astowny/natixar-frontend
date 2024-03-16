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
  IdTreeNode,
  IndexOf,
} from "./EmissionTypes"

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
    areaHierarchy: [],
    entityHierarchy: [],
  },
  allPoints: [],
  visibleFrame: {
    allPoints: [],
    byCompany: [],
    byCountry: [],
  },
  globalFilter: { ...initialFilterState },
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

const alignIndexes = (originalIndexes: IndexesContainer): AlignedIndexes => {
  const alignedBusinessEntities = Object.fromEntries(
    originalIndexes.entity.map((company) => [company.id, company]),
  )
  const alignedAreas = Object.fromEntries(
    originalIndexes.area.map((area) => [area.id, area]),
  )

  const alignedCategories = Object.fromEntries(
    originalIndexes.category.map((category) => [category.id, category]),
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
        .map((era) => {
          switch (era.toLowerCase()) {
            case "d":
              return "Downstream"
            case "u":
              return "Upstream"
            case "o":
              return "Operation"
            default:
              return ""
          }
        })
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
