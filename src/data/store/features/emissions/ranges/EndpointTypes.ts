import {
  DataPoint,
  GlobalFilterState,
  PerceivedData,
} from "../../coordinates/Types"
import {
  AlignedIndexes,
  BusinessEntity,
  CompressedDataPoint,
  EmissionCategory,
  GeographicalArea,
  TimeWindow,
} from "./EmissionTypes"

export interface IndexesContainer {
  entity: BusinessEntity[]
  area: GeographicalArea[]
  category: EmissionCategory[]
}

export interface EmissionRangesPayload {
  time_range: TimeWindow
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

export interface EmissionRangeState {
  alignedIndexes: AlignedIndexes
  allPoints: DataPoint[]
  visibleFrame: PerceivedData
  globalFilter: GlobalFilterState
}
