import { Paper } from "@mui/material"
import EmissionByKeyStacked from "components/charts/emissions/EmissionByKeyStacked"
import { selectTimeWindow as timeWindowSelector } from "data/store/api/EmissionSelectors"
import { emissionsGroupByTime } from "data/store/api/EmissionTransformers"
import { EmissionDataPoint } from "data/store/features/emissions/ranges/EmissionTypes"
import { memo } from "react"
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

const TotalEmissionByTimeSection = ({
  emissionPoints,
}: TotalEmissionByTimeProps) => {
  // const [timeUnit, setTimeUnit] = useState(TimeMeasurement.MINUTES)
  // <ChartCard
  // title="Total Emissions"
  // value="12,900 CO2 (t)"
  // date="01 Dec - 31 Feb 2021"
  // slot={timeUnit}
  // setSlot={setTimeUnit}
  // >
  const timeWindow = useSelector(timeWindowSelector)

  const groupedByTime = emissionsGroupByTime(
    emissionPoints,
    timeWindow,
    timestampToMonth,
  )

  return (
    <Paper
      sx={{
        p: "1rem",
      }}
    >
      <EmissionByKeyStacked
        groupedData={groupedByTime}
        keys={Object.values(monthLayout)}
      />
    </Paper>
  )
}

export default memo(TotalEmissionByTimeSection)
