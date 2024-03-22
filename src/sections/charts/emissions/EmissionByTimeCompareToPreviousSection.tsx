import { memo, useMemo, useState } from "react"

import { selectTimeWindow as timeWindowSelector } from "data/store/api/EmissionSelectors"
import { useSelector } from "react-redux"
import { ChartCard } from "components/natixarComponents/ChartCard/ChartCard"
import {
  emissionsGroupByTime,
  formatEmissionAmount,
} from "data/domain/transformers/EmissionTransformers"
import EmissionByKeyComparison from "components/charts/emissions/EmissionByKeyComparison"
import { TotalEmissionByTimeProps } from "./TotalEmissionByTimeSection"

const EmissionByTimeCompareToPreviousSection = ({
  emissionPoints,
  unitLayout,
  startDate,
  endDate,
}: TotalEmissionByTimeProps) => {
  const timeDetailSlots = useMemo(() => Object.keys(unitLayout), [unitLayout])
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
    unitLayout[timeDetailUnit],
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
      startDate={startDate}
      endDate={endDate}
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
