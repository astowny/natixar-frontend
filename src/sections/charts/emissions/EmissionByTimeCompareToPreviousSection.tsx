import { useMemo, useState } from "react"

import { selectTimeWindow as timeWindowSelector } from "data/store/api/EmissionSelectors"
import { useSelector } from "react-redux"
import { ChartCard } from "components/natixarComponents/ChartCard/ChartCard"
import {
  emissionsGroupByTime,
  formatEmissionAmount,
} from "data/domain/transformers/EmissionTransformers"
import EmissionByKeyComparison from "components/charts/emissions/EmissionByKeyComparison"
import useAsyncWork from "hooks/useAsyncWork"
import { TotalEmissionByTimeProps } from "./TotalEmissionByTimeSection"

const EmissionByTimeCompareToPreviousSection = ({
  emissionPoints,
  unitLayout,
  startDate,
  endDate,
  timeDetailUnit,
  setTimeDetailUnit,
}: TotalEmissionByTimeProps) => {
  const timeDetailSlots = useMemo(() => Object.keys(unitLayout), [unitLayout])
  const timeWindow = useSelector(timeWindowSelector)
  const [totalEmissions, setTotalEmissions] = useState("")
  const [showComparison, setShowComparison] = useState(false)
  useAsyncWork(
    () => {
      const sumEmission = emissionPoints.reduce(
        (acc, cur) => acc + cur.totalEmissionAmount,
        0,
      )
      return formatEmissionAmount(sumEmission)
    },
    setTotalEmissions,
    [emissionPoints],
  )

  const [timeFormatter, timeSorter] = unitLayout[timeDetailUnit]
  const [datasetA, setDatasetA] = useState<
    Record<string, Record<string, number>>
  >({})
  useAsyncWork(
    () => emissionsGroupByTime(emissionPoints, timeWindow, timeFormatter),
    setDatasetA,
    [emissionPoints, timeWindow, timeFormatter],
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
  ).toSorted(timeSorter)

  const percentage = Math.round(Math.random() * 200 - 100)

  return (
    <ChartCard
      title="Trend stacked bars CO2"
      value={totalEmissions}
      startDate={startDate}
      endDate={endDate}
      slots={timeDetailSlots}
      selectedSlot={timeDetailUnit}
      setSelectedSlot={setTimeDetailUnit}
      percentage={percentage}
      showCompareButton
      compare={showComparison}
      setCompare={setShowComparison}
    >
      <EmissionByKeyComparison
        dataSetA={datasetA}
        dataSetB={showComparison ? datasetB : undefined}
        keys={allKeys}
      />
    </ChartCard>
  )
}

export default EmissionByTimeCompareToPreviousSection
