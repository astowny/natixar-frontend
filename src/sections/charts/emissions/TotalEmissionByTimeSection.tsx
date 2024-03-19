import { Paper } from "@mui/material"
import EmissionByKeyStacked from "components/charts/emissions/EmissionByKeyStacked"
import { ChartCard } from "components/natixarComponents/ChartCard/ChartCard"
import { timeStamp } from "console"
import { selectTimeWindow as timeWindowSelector } from "data/store/api/EmissionSelectors"
import { emissionsGroupByTime } from "data/store/api/EmissionTransformers"
import { EmissionDataPoint } from "data/store/features/emissions/ranges/EmissionTypes"
import { memo, useMemo } from "react"
import { useSelector } from "react-redux"

interface TotalEmissionByTimeProps {
  emissionPoints: EmissionDataPoint[]
}

const monthLayout: Record<number, string> = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
}

const timestampToMonth = (timestamp: number): string => {
  const monthNumber = new Date(timestamp).getMonth() + 1
  return monthLayout[monthNumber] ?? ""
}

const detailUnitLayout: Record<string, (time: number) => string> = {
  Month: timestampToMonth,
  Quarter: timestampToMonth,
  Year: timestampToMonth,
}

const TotalEmissionByTimeSection = ({
  emissionPoints,
}: TotalEmissionByTimeProps) => {
  // const [timeUnit, setTimeUnit] = useState(TimeMeasurement.MINUTES)

  const timeWindow = useSelector(timeWindowSelector)
  const timeDetailSlots = useMemo(
    () => Object.keys(detailUnitLayout),
    [detailUnitLayout],
  )

  const groupedByTime = emissionsGroupByTime(
    emissionPoints,
    timeWindow,
    timestampToMonth,
  )

  return (
    <ChartCard
      title="Total Emissions"
      value="12,900 CO2 (t)"
      startDate={new Date(timeWindow.startTimestamp)}
      endDate={new Date(timeWindow.endTimestamp)}
      slots={timeDetailSlots}
    >
      <EmissionByKeyStacked
        groupedData={groupedByTime}
        keys={Object.values(monthLayout)}
      />
    </ChartCard>
  )
}

export default memo(TotalEmissionByTimeSection)
