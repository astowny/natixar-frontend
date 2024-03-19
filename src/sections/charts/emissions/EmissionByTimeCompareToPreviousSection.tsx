import { memo, useMemo, useState } from "react"

import { selectTimeWindow as timeWindowSelector } from "data/store/api/EmissionSelectors"
import { useSelector } from "react-redux"
import { ChartCard } from "components/natixarComponents/ChartCard/ChartCard"
import {
  emissionsGroupByTime,
  formatEmissionAmount,
} from "data/domain/transformers/EmissionTransformers"
import EmissionByKeyComparison from "components/charts/emissions/EmissionByKeyComparison"
import {
  timestampToMonth,
  timestampToQuarter,
} from "data/domain/transformers/TimeTransformers"
import { TotalEmissionByTimeProps } from "./TotalEmissionByTimeSection"

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
        entry[1] * Math.random(),
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
