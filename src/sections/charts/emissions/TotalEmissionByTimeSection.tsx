import EmissionByKeyStacked from "components/charts/emissions/EmissionByKeyStacked"
import { ChartCard } from "components/natixarComponents/ChartCard/ChartCard"
import { selectTimeWindow as timeWindowSelector } from "data/store/api/EmissionSelectors"
import {
  emissionsGroupByTime,
  formatEmissionAmount,
} from "data/domain/transformers/EmissionTransformers"
import { EmissionDataPoint } from "data/domain/types/emissions/EmissionTypes"
import { memo, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import {
  timestampToMonth,
  timestampToQuarter,
  timestampToYear,
} from "data/domain/transformers/TimeTransformers"

export interface TotalEmissionByTimeProps {
  emissionPoints: EmissionDataPoint[]
}

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
