interface Location {
    lat: number,
    lon: number,
    country: string
}

interface DataPoint {
    id: string,
    time: number,
    emission_amount: number,
    emission_measure: string,
    category: string,
    company: string,
    location: Location
}

interface ByCompanyDataPoint {
    operation: number,
    upstream: number,
    downstream: number,
    cluster: number,
    company: string
}

interface ByCountryDataPoint {
    operation: number,
    upstream: number,
    downstream: number,
    cluster: number,
    country: string
}

interface PerceivedData {
    allPoints: Array<DataPoint>,
    byCompany: Array<ByCompanyDataPoint>,
    byCountry: Array<ByCountryDataPoint>
}

interface DataLayout {
    [key: string]: Array<DataPoint>
}

interface SelectedCluster {
    dataPoints: Array<DataPoint>
}

interface DataSet {
    min_time: number,
    max_time: number,
    totalSteps: number,
    categories: string[],
    companies: string[],
    countries: string[],
    data: DataLayout
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
    from: number,
    to: number
}

interface EmissionStorage {
    wholeDataSet: DataSet,
    filter: DateTimeRangeFilter,
    visibleFrame: PerceivedData
}

export type { DataPoint }
export type { ByCompanyDataPoint }
export type { ByCountryDataPoint }

export type { Location }
export type { PerceivedData }
export type { SelectedCluster }
export type { DataSet }
export type { EmissionStorage }

export type { DateTimeRangeFilter }
