import EmissionByKeyStacked from "components/charts/emissions/EmissionByKeyStacked"
import { emissionsGroupByTime } from "data/store/api/EmissionTransformers"
import {
  EmissionDataPoint,
  TimeWindow,
} from "data/store/features/emissions/ranges/EmissionTypes"
import { memo } from "react"

interface TotalEmissionByTimeProps {
  emissionPoints: EmissionDataPoint[]
  timeWindow: TimeWindow
}

const TotalEmissionByTimeSection = ({
  emissionPoints,
  timeWindow,
}: TotalEmissionByTimeProps) => {
  // const [timeUnit, setTimeUnit] = useState(TimeMeasurement.MINUTES)
  // <ChartCard
  // title="Total Emissions"
  // value="12,900 CO2 (t)"
  // date="01 Dec - 31 Feb 2021"
  // slot={timeUnit}
  // setSlot={setTimeUnit}
  // >

  const groupedByTime = emissionsGroupByTime(
    emissionPoints,
    timeWindow,
    (timestamp: number) => "abc",
  )

  return <EmissionByKeyStacked groupedData={groupedByTime} keys={["abc"]} />
}

export default memo(TotalEmissionByTimeSection)
