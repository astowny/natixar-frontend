import {
  BusinessEntity,
  CompressedDataPoint,
  EmissionCategory,
  GeographicalArea,
  TimeWindow,
} from "./Types"

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
