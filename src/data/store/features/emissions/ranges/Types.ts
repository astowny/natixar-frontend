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

export type CompressedDataPoint = number[]
