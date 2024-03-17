export interface TimeWindow {
  start: string
  end: string
  step: number | number[]
}

export interface BusinessEntity {
  id: number
  parent?: number
  name: string
  type: "Company" | "Division" | "Step"
  details?: BusinessEntityDetails
  image?: string
}

export interface BusinessEntityDetails {
  supplier: boolean
  customer: boolean
  ownOperation: boolean
  financialControl?: boolean
  operationalControl?: boolean
  capital?: boolean
  registration: string
  address?: string
}

export interface GeographicalArea {
  id: number
  parent?: number
  name: string
  type:
    | "World region"
    | "Continent"
    | "Country"
    | "State"
    | "Region"
    | "County"
    | "City"
    | "Location"
    | "Unit"
  details?: GeographicalAreaDetails
}

export interface GeographicalAreaDetails {
  lat: number
  long: number
  operatorId: number
  ownerId?: number
}

export interface EmissionCategory {
  id: number
  parent?: number
  name: string
  code?: string
  era?: string
}

export type IdTreeNode = Tree<number>

export type Tree<T> = {
  parent?: Tree<T>
  value: T
  children: Tree<T>[]
}

export type IndexOf<T> = Record<number, T>

export interface AlignedIndexes {
  entities: IndexOf<BusinessEntity>
  areas: IndexOf<GeographicalArea>
  areaHierarchy: IdTreeNode[]
  entityHierarchy: IdTreeNode[]
  categories: IndexOf<EmissionCategory>
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

export class EmissionDataPoint {
  private compressedData: CompressedDataPoint

  readonly id: string

  constructor(id: string, data: CompressedDataPoint) {
    this.id = id
    this.compressedData = data
  }

  private attrBy(index: number): number {
    return this.compressedData[index]
  }

  categoryId(): number {
    return this.attrBy(CdpLayoutItem.CDP_LAYOUT_CATEGORY)
  }

  businessEntityId(): number {
    return this.attrBy(CdpLayoutItem.CDP_LAYOUT_ENTITY)
  }

  geoAreaId(): number {
    return this.attrBy(CdpLayoutItem.CDP_LAYOUT_AREA)
  }

  emissionIntensity(): number {
    return this.attrBy(CdpLayoutItem.CDP_LAYOUT_INTENSITY)
  }

  startTimeSlot(): number {
    return this.attrBy(CdpLayoutItem.CDP_LAYOUT_START)
  }

  endTimeSlot(): number {
    return this.attrBy(CdpLayoutItem.CDP_LAYOUT_END)
  }

  startIntensityPercentage(): number {
    return this.attrBy(CdpLayoutItem.CDP_LAYOUT_START_PERCENTAGE)
  }

  endIntensityPercentage(): number {
    return this.attrBy(CdpLayoutItem.CDP_LAYOUT_END_PERCENTAGE)
  }
}

export interface VisibleData {
  emissionPoints: EmissionDataPoint[]
}

export interface EmissionFilterState {
  selectedBusinessEntities: number[]
  selectedGeographicalAreas: number[]
  selectedCategories: string[]
}

export interface EmissionRangeState {
  alignedIndexes: AlignedIndexes
  allPoints: EmissionDataPoint[]
  visiblePoints: VisibleData
  overallTimeWindow: TimeWindow
  emissionFilterState: EmissionFilterState
}

export interface GroupedDataPoints {
  groupKey: string
  groupedEmissionsByCategory: Record<string, number>
}
