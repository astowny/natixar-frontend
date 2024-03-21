import {
  BusinessEntity,
  CountryLocation,
  GeographicalArea,
} from "../participants/ContributorsTypes"
import { IdTreeNode, IndexOf } from "../structures/StructuralTypes"
import { TimeWindow } from "../time/TimeRelatedTypes"

export interface EmissionCategory {
  id: number
  parent?: number
  name: string
  code?: string
  era: string
}

export interface AlignedIndexes {
  entities: IndexOf<BusinessEntity>
  areas: IndexOf<GeographicalArea>
  categories: IndexOf<EmissionCategory>
  areaHierarchy: IdTreeNode[]
  entityHierarchy: IdTreeNode[]
  categoryHierarchy: IdTreeNode[]
}

export type CompressedDataPoint = number[]

export enum CdpLayoutItem {
  CDP_LAYOUT_START = 0,
  CDP_LAYOUT_START_PERCENTAGE,
  CDP_LAYOUT_INTENSITY,
  CDP_LAYOUT_END,
  CDP_LAYOUT_END_PERCENTAGE,
  CDP_LAYOUT_ENTITY,
  CDP_LAYOUT_AREA,
  CDP_LAYOUT_THIRD_PARTY,
  CDP_LAYOUT_CATEGORY,
}

export interface EmissionDataPoint {
  id: string
  totalEmissionAmount: number
  categoryId: number
  categoryEraName: string
  entityId: number
  companyId: number
  companyName: string
  geoAreaId: number
  countryId: number
  location: CountryLocation

  startTimeSlot: number
  startEmissionPercentage: number
  endTimeSlot: number
  endEmissionPercentage: number
  emissionIntensity: number
}

export interface VisibleData {
  emissionPoints: EmissionDataPoint[]
  emissionsByCompany: Record<string, IndexOf<number>>
  emissionsByCountry: Record<string, IndexOf<number>>
}

export interface EmissionFilterState {
  selectedBusinessEntities: number[]
  selectedGeographicalAreas: number[]
  selectedCategories: string[]
}

export interface EmissionRangeState {
  alignedIndexes: AlignedIndexes
  allPoints: EmissionDataPoint[]
  visibleData: VisibleData
  overallTimeWindow: TimeWindow
  emissionFilterState: EmissionFilterState
}
