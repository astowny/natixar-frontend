import { ChartCard } from "components/natixarComponents/ChartCard/ChartCard"
import { memo } from "react"
import IncomeAreaChart from "sections/dashboard/default/IncomeAreaChart"

interface TotalEmissionByTimeProps {}

const TotalEmissionByTimeSection = () => (
  <ChartCard
    title="Total Emissions"
    value="12,900 CO2 (t)"
    date="01 Dec - 31 Feb 2021"
    slot={areaSlot}
    setSlot={setAreaSlot}
  >
    <IncomeAreaChart
      allDataPoints={allDataPoints}
      alignedIndexes={alignedItems}
    />
  </ChartCard>
)

export default memo(TotalEmissionByTimeSection)
