import { useState } from "react"

// material-ui
import { Grid, Typography } from "@mui/material"

// project import
import MainCard from "components/MainCard"

import IncomeAreaChart from "sections/dashboard/default/IncomeAreaChart"
import {
  selectAlignedIndexes,
  selectVisibleData,
} from "data/store/api/EmissionSelectors"
import { useSelector } from "react-redux"
import { useGetEmissionRangesQuery } from "data/store/features/emissions/ranges/EmissionRangesClient"
import EmissionByCategorySection from "../../components/natixarComponents/CO2DonutSection"

// assets
import { ChartCard } from "../../components/natixarComponents/ChartCard/ChartCard"
import AcquisitionChart from "../../sections/dashboard/analytics/AcquisitionChart"
import DateFilter from "../../components/DateFilter"

// ==============================|| WIDGET - CHARTS ||============================== //

const NatixarChart = () => {
  const [areaSlot, setAreaSlot] = useState("month")
  const [acquisitionSlot, setAcquisitionSlot] = useState("month")
  const [compare, setCompare] = useState(false)

  const allDataPoints = useSelector(selectVisibleData)
  const alignedItems = useSelector(selectAlignedIndexes)
  useGetEmissionRangesQuery({
    protocol: "ghgprotocol",
    scale: "m",
    timeRanges: [
      {
        start: "2023-01-01T00:00:00Z",
        end: "2023-01-02T00:00:00Z",
        scale: "m",
      },
    ],
  })

  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      {/* <Grid item xs={12} md={12} xl={12}>
        <MainCard>
          <DateFilter />
        </MainCard>
      </Grid> */}
      <Grid item xs={12} md={12} xl={12}>
        <MainCard>
          <Typography variant="h5" sx={{ marginBottom: "15px" }}>
            Scope Emissions
          </Typography>
          <EmissionByCategorySection
            allDataPoints={allDataPoints}
            alignedIndexes={alignedItems}
          />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <ChartCard
          title="Total Emissions"
          value="12,900 CO2 (t)"
          date="01 Dec - 31 Feb 2021"
          slot={areaSlot}
          setSlot={setAreaSlot}
        >
          {/* <IncomeAreaChart */}
          {/* allDataPoints={allDataPoints} */}
          {/* alignedIndexes={alignedItems} */}
          {/* /> */}
        </ChartCard>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <ChartCard
          title="Trend stacked bars CO2"
          value="12,900 CO2 (t)"
          date="01 Dec - 08 Jan 2022"
          slot={acquisitionSlot}
          setSlot={setAcquisitionSlot}
          compareButton
          compare={compare}
          setCompare={setCompare}
        >
          {/* <AcquisitionChart slot={acquisitionSlot} compare={compare} /> */}
        </ChartCard>
      </Grid>
    </Grid>
  )
}

export default NatixarChart
