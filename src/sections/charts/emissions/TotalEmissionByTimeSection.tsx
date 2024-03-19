import EmissionByKeyStacked from "components/charts/emissions/EmissionByKeyStacked"
import { ChartCard } from "components/natixarComponents/ChartCard/ChartCard"
import { selectTimeWindow as timeWindowSelector } from "data/store/api/EmissionSelectors"
import { emissionsGroupByTime } from "data/store/api/EmissionTransformers"
import { EmissionDataPoint } from "data/store/features/emissions/ranges/EmissionTypes"
import { memo, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { formatEmissionAmount } from "utils/formatAmounts"

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
  const date = new Date(timestamp)
  const monthNumber = date.getMonth() + 1
  let result = monthLayout[monthNumber]
  if (result) {
    result += ` ${date.getFullYear()}`
  }
  return result ?? ""
}

const timestampToQuarter = (timestamp: number): string => {
  const date = new Date(timestamp)
  const quarterNumber = 1 + Math.ceil(date.getMonth() / 4)
  return `Q${quarterNumber}`
}

const timestampToYear = (timestamp: number): string =>
  new Date(timestamp).getFullYear().toString()

const detailUnitLayout: Record<string, (time: number) => string> = {
  Month: timestampToMonth,
  Quarter: timestampToQuarter,
  Year: timestampToYear,
}

const TotalEmissionByTimeSection = ({
  emissionPoints,
}: TotalEmissionByTimeProps) => {
  const timeDetailSlots = useMemo(
    () => Object.keys(detailUnitLayout),
    [detailUnitLayout],
  )
  const [timeDetailUnit, setTimeDetailUnit] = useState(timeDetailSlots[0])

  const timeWindow = useSelector(timeWindowSelector)

  const totalEmissions = useMemo(() => {
    const sumEmission = emissionPoints.reduce(
      (acc, cur) => acc + cur.totalEmissionAmount,
      0,
    )
    return formatEmissionAmount(sumEmission)
  }, [emissionPoints])

  const groupedByTime = emissionsGroupByTime(
    emissionPoints,
    timeWindow,
    detailUnitLayout[timeDetailUnit],
  )

  let allKeys = Array.from(
    new Set(
      Object.values(groupedByTime).flatMap((byKey) => Object.keys(byKey)),
    ),
  )

  if (timeDetailUnit !== "Month") {
    allKeys = allKeys.toSorted()
  }

  return (
    <ChartCard
      title="Total Emissions"
      value={totalEmissions}
      startDate={new Date(timeWindow.startTimestamp)}
      endDate={new Date(timeWindow.endTimestamp)}
      slots={timeDetailSlots}
      selectedSlot={timeDetailUnit}
      setSelectedSlot={setTimeDetailUnit}
    >
      <EmissionByKeyStacked groupedData={groupedByTime} keys={allKeys} />
    </ChartCard>
  )
}

export default memo(TotalEmissionByTimeSection)
