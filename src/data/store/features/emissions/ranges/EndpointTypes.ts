import {
  BusinessEntity,
  CompressedDataPoint,
  EmissionCategory,
  GeographicalArea,
} from "./EmissionTypes"

export interface IndexesContainer {
  entity: BusinessEntity[]
  area: GeographicalArea[]
  category: EmissionCategory[]
}

export interface EndpointTimeWindow {
  start: string
  end: string
  step: number | number[]
}

export interface EmissionRangesPayload {
  time_range: EndpointTimeWindow
  indexes: IndexesContainer
  data: CompressedDataPoint[]
}

export type TimeRangeScale = "m" | "h" | "d" | "w" | "M" | "Q" | "y"
export type EmissionProtocol = "ghgprotocol" | "beges" | "begesv5"

export interface TimeRangeRequest {
  start: string
  end: string
  scale?: TimeRangeScale
}

export interface EmissionRangesRequest {
  timeRanges: TimeRangeRequest[]
  protocol: EmissionProtocol
  scale: TimeRangeScale
}
