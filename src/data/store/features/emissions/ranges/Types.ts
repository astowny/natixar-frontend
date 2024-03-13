export interface TimeWindow {
  start: string
  end: string
  step: number[]
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

export interface AlignedIndexes {
  entities: Record<number, BusinessEntity>
  areas: Record<number, GeographicalArea>
  categories: Record<number, EmissionCategory>
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
