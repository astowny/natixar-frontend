import { memo, useMemo, useState } from "react"

import { selectTimeWindow as timeWindowSelector } from "data/store/api/EmissionSelectors"
import { useSelector } from "react-redux"
import { ChartCard } from "components/natixarComponents/ChartCard/ChartCard"
import { formatEmissionAmount } from "utils/formatAmounts"
import EmissionByKeyComparison from "components/charts/emissions/EmissionByKeyComparison"
import { emissionsGroupByTime } from "data/store/api/EmissionTransformers"
import { TotalEmissionByTimeProps } from "./TotalEmissionByTimeSection"

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

const detailUnitLayout: Record<string, (time: number) => string> = {
  Month: timestampToMonth,
  Quarter: timestampToQuarter,
}

const EmissionByTimeCompareToPreviousSection = ({
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

  const datasetA = emissionsGroupByTime(
    emissionPoints,
    timeWindow,
    detailUnitLayout[timeDetailUnit],
  )

  const datasetB: typeof datasetA = {}

  Object.keys(datasetA).forEach((category) => {
    datasetB[category] = Object.fromEntries(
      Object.entries(datasetA[category]).map((entry) => [
        entry[0],
        entry[1] * -0.3,
      ]),
    )
  })

  const allKeys = Array.from(
    new Set(Object.values(datasetA).flatMap((byKey) => Object.keys(byKey))),
  )

  return (
    <ChartCard
      title="Trend stacked bars CO2"
      value={totalEmissions}
      startDate={new Date(timeWindow.startTimestamp)}
      endDate={new Date(timeWindow.endTimestamp)}
      slots={timeDetailSlots}
      selectedSlot={timeDetailUnit}
      setSelectedSlot={setTimeDetailUnit}
    >
      <EmissionByKeyComparison
        dataSetA={datasetA}
        dataSetB={datasetB}
        keys={allKeys}
      />
    </ChartCard>
  )
}

export default memo(EmissionByTimeCompareToPreviousSection)
