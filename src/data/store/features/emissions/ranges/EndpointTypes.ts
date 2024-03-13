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

export interface EmissionRangeState {
  wholeDataSet?: EmissionRangesPayload
  alignedIndexes: AlignedIndexes
  allPoints: DataPoint[]
  visibleFrame: PerceivedData
  globalFilter: GlobalFilterState
}
