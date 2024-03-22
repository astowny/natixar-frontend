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

export interface TotalEmissionByTimeProps {
  emissionPoints: EmissionDataPoint[]
  unitLayout: Record<string, (time: number) => string>
  startDate: Date
  endDate: Date
}

const TotalEmissionByTimeSection = ({
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

  const groupedByTime = emissionsGroupByTime(
    emissionPoints,
    timeWindow,
    unitLayout[timeDetailUnit],
  )

  const allKeys = Array.from(
    new Set(
      Object.values(groupedByTime).flatMap((byKey) => Object.keys(byKey)),
    ),
  )

  return (
    <ChartCard
      title="Total Emissions"
      value={totalEmissions}
      startDate={startDate}
      endDate={endDate}
      slots={timeDetailSlots}
      selectedSlot={timeDetailUnit}
      setSelectedSlot={setTimeDetailUnit}
    >
      <EmissionByKeyStacked groupedData={groupedByTime} keys={allKeys} />
    </ChartCard>
  )
}

export default memo(TotalEmissionByTimeSection)
