import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit"
import { v4 as uuid } from "uuid"
import {
  extractNameOfEra,
  dataPointsGroupByCompanyAndCategory,
  dataPointsGroupByCountryAndCategory,
} from "data/store/api/EmissionTransformers"
import { detectCompany, detectCountry } from "data/store/api/DataDetectors"
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
  CompressedDataPoint,
  CdpLayoutItem,
  CountryLocation,
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
  visibleData: {
    emissionPoints: [],
    emissionsByCompany: {},
    emissionsByCountry: {},
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

const calculateTotalAmount = (
  dataPoint: CompressedDataPoint,
  overallTimeWindow: TimeWindow,
): number => {
  // TODO more accurate step usage
  const seconds =
    typeof overallTimeWindow.step === "number"
      ? overallTimeWindow.step
      : overallTimeWindow.step[0]

  const duration =
    seconds *
    (dataPoint[CdpLayoutItem.CDP_LAYOUT_END] -
      dataPoint[CdpLayoutItem.CDP_LAYOUT_START] -
      2 +
      dataPoint[CdpLayoutItem.CDP_LAYOUT_START_PERCENTAGE] +
      dataPoint[CdpLayoutItem.CDP_LAYOUT_END_PERCENTAGE])

  return duration * dataPoint[CdpLayoutItem.CDP_LAYOUT_INTENSITY]
}

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

const cdpToEdp = (
  cdp: CompressedDataPoint,
  indexes: AlignedIndexes,
  timeWindow: TimeWindow,
): EmissionDataPoint => {
  const categoryId = cdp[CdpLayoutItem.CDP_LAYOUT_CATEGORY]
  const origEra = indexes.categories[categoryId]?.era
  const entityId = cdp[CdpLayoutItem.CDP_LAYOUT_ENTITY]
  const company = detectCompany(entityId, indexes)

  const geoAreaId = cdp[CdpLayoutItem.CDP_LAYOUT_AREA]
  const geoArea = indexes.areas[geoAreaId]
  const country = detectCountry(geoAreaId, indexes)
  const countryLocation: CountryLocation = {
    lat: country.details?.lat ?? geoArea.details?.lat ?? 0,
    lon: country.details?.long ?? geoArea.details?.long ?? 0,
    country: country.name,
  }

  const totalAmount = calculateTotalAmount(cdp, timeWindow)

  return {
    id: uuid(),
    totalEmissionAmount: totalAmount,
    categoryId,
    categoryEraName: extractNameOfEra(origEra),
    entityId,
    companyId: company.id,
    companyName: company.name,
    geoAreaId,
    countryId: country.id,
    location: countryLocation,
  }
}

function filterRoutine<T>(currentValue: T, filterSelectedValues: T[]): boolean {
  return (
    filterSelectedValues.length === 0 ||
    filterSelectedValues.includes(currentValue)
  )
}

const findTreeNode = (
  id: number,
  nodes: IdTreeNode[],
): IdTreeNode | undefined => {
  let nodeFound = nodes.find((node) => node.value === id)
  if (!nodeFound) {
    nodeFound = nodes.find((node) => findTreeNode(id, node.children))
  }
  return nodeFound
}

const selectExpandedSubTree = (
  values: number[],
  nodes: IdTreeNode[],
  results: number[],
) => {
  if (values.length === 0 || nodes.length === 0) {
    return
  }
  const foundNodes: IdTreeNode[] = values
    .flatMap((value) => findTreeNode(value, nodes))
    .filter((node) => typeof node !== "undefined")
    .map((node) => node!!)
  if (foundNodes.length === 0) {
    return
  }

  foundNodes.forEach((node) => {
    if (!results.includes(node.value)) {
      results.push(node.value)
      selectExpandedSubTree(values, node.children, results)
    }
  })
}

const expandId = (ids: number[], nodes: IdTreeNode[]): number[] => {
  const result: number[] = []
  selectExpandedSubTree(ids, nodes, result)
  return result
}

const extractVisibleData = (
  dataPoints: EmissionDataPoint[],
  indexes: AlignedIndexes,
  filter: EmissionFilterState,
): VisibleData => {
  const filteredDataPoints = dataPoints
  if (filter.selectedCategories.length > 0) {
    filteredDataPoints.filter((dataPoint) => {
      const era = dataPoint.categoryEraName
      return filterRoutine(era.toLowerCase(), filter.selectedCategories)
    })
  }
  if (filter.selectedBusinessEntities.length > 0) {
    const expandedEntityIds = expandId(
      filter.selectedBusinessEntities,
      indexes.entityHierarchy,
    )

    filteredDataPoints.filter((dataPoint) =>
      filterRoutine(dataPoint.entityId, expandedEntityIds),
    )
  }

  if (filter.selectedGeographicalAreas.length > 0) {
    const expandedGeoAreaIds = expandId(
      filter.selectedGeographicalAreas,
      indexes.areaHierarchy,
    )

    filteredDataPoints.filter((dataPoint) =>
      filterRoutine(dataPoint.geoAreaId, expandedGeoAreaIds),
    )
  }

  return {
    emissionPoints: filteredDataPoints,
    emissionsByCompany: dataPointsGroupByCompanyAndCategory(filteredDataPoints),
    emissionsByCountry: dataPointsGroupByCountryAndCategory(filteredDataPoints),
  }
}

const extractAndProcessVisibleData = (state: EmissionRangeState) => {
  const newVisibleData = extractVisibleData(
    state.allPoints,
    state.alignedIndexes,
    state.emissionFilterState,
  )
  state.visibleData = newVisibleData
}

const setSelectedBusinessEntitiesReducer: CaseReducer<
  EmissionRangeState,
  PayloadAction<number[]>
> = (state, action) => {
  state.emissionFilterState = {
    ...state.emissionFilterState,
    selectedBusinessEntities: action.payload,
  }
  extractAndProcessVisibleData(state as EmissionRangeState)
}

const setSelectedGeoAreasReducer: CaseReducer<
  EmissionRangeState,
  PayloadAction<number[]>
> = (state, action) => {
  state.emissionFilterState = {
    ...state.emissionFilterState,
    selectedGeographicalAreas: action.payload,
  }
  extractAndProcessVisibleData(state as EmissionRangeState)
}

const setSelectedCategoriesReducer: CaseReducer<
  EmissionRangeState,
  PayloadAction<string[]>
> = (state, action) => {
  state.emissionFilterState = {
    ...state.emissionFilterState,
    selectedCategories: action.payload,
  }
  extractAndProcessVisibleData(state as EmissionRangeState)
}

const setNewFilterReducer: CaseReducer<
  EmissionRangeState,
  PayloadAction<EmissionFilterState>
> = (state, action) => {
  state.emissionFilterState = { ...action.payload }
  extractAndProcessVisibleData(state as EmissionRangeState)
}

const clearFilterSelectionsReducer: CaseReducer<
  EmissionRangeState,
  PayloadAction
> = (state) => {
  state.emissionFilterState = { ...initialFilterState }
  extractAndProcessVisibleData(state as EmissionRangeState)
}

export const emissionsRangeSlice = createSlice({
  name: "emissionRanges",
  initialState,
  reducers: {
    selectBusinessEntities: setSelectedBusinessEntitiesReducer,
    selectGeoAreas: setSelectedGeoAreasReducer,
    selectCategories: setSelectedCategoriesReducer,
    updateFilterSelection: setNewFilterReducer,
    clearFilterSelection: clearFilterSelectionsReducer,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      emissionRangesApi.endpoints.getEmissionRanges.matchFulfilled,
      (state, action) => {
        const alignedIndexes = alignIndexes(action.payload.indexes)
        const timeWindow = action.payload.time_range
        const allPoints = action.payload.data.map((cdp) =>
          cdpToEdp(cdp, alignedIndexes, timeWindow),
        )
        // const availableFilters = extractFilters(alignedIndexes)
        const visibleData = extractVisibleData(
          allPoints,
          alignedIndexes,
          state.emissionFilterState,
        )

        state.alignedIndexes = alignedIndexes
        state.allPoints = allPoints
        state.visibleData = visibleData
        state.overallTimeWindow = timeWindow
        // state.emissionFilterState = availableFilters
      },
    )
  },
})

export const {
  selectBusinessEntities,
  selectGeoAreas,
  selectCategories,
  updateFilterSelection,
  clearFilterSelection,
} = emissionsRangeSlice.actions
export default emissionsRangeSlice.reducer
