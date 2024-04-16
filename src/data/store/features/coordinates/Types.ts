interface Location {
  lat: number
  lon: number
  country: string
}

interface DataPoint {
  id: string
  time: number
  emission_amount: number
  emission_measure: string
  category: string
  company: string
  location: Location
}

interface CategorizedEmissionData {
  [key: string]: number
}

interface ByCompanyDataPoint {
  company: string
  emissionsByCategory: CategorizedEmissionData
}

interface ByCountryDataPoint {
  country: string
  emissionsByCategory: CategorizedEmissionData
}

interface PerceivedData {
  allPoints: Array<DataPoint>
  byCompany: Array<ByCompanyDataPoint>
  byCountry: Array<ByCountryDataPoint>
}

interface DataPartitions {
  [key: string]: Array<DataPoint>
}

interface SelectedCluster {
  dataPoints: Array<DataPoint>
}

interface DataSet {
  partitionsByTime: DataPartitions
}

interface EmissionStorage {
  wholeDataSet: DataSet
  visibleFrame: PerceivedData
  globalFilter: GlobalFilterState
}

/* 
    Suppose, we have a sequence of partitions by timestamp
    We keep track of the last N timestamps
    Here we specify the range, relative to the most recent known timestamp
    So, for example, if N = 6 and we have the filder { from: 1, to: 3 } ->
    -5s -4s -3s -2s -1s now
        [         ]
    we will ^ select this time window
*/
interface DateTimeRangeFilter {
  from: number
  to: number
}

interface GlobalEmissionFilter {
  companies: string[]
  countries: string[]
  categories: string[]
  timeRange: DateTimeRangeFilter
}

interface GlobalFilterState {
  availableValues: GlobalEmissionFilter
  selectedValues: GlobalEmissionFilter
}

export type { Location }
export type { DataPoint }
export type { ByCompanyDataPoint }
export type { ByCountryDataPoint }

export type { PerceivedData }
export type { SelectedCluster }
export type { DataSet }
export type { DataPartitions }
export type { EmissionStorage }

export type { DateTimeRangeFilter, GlobalEmissionFilter, GlobalFilterState }
