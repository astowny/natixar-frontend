import { useState } from "react"

// material-ui
import { Grid, Typography } from "@mui/material"

// project import
import MainCard from "components/MainCard"

import IncomeAreaChart from "sections/dashboard/default/IncomeAreaChart"
import CO2DonutSection from "../../components/natixarComponents/CO2DonutSection"

// assets
import { ChartCard } from "../../components/natixarComponents/ChartCard"
import AcquisitionChart from "../../sections/dashboard/analytics/AcquisitionChart"

// ==============================|| WIDGET - CHARTS ||============================== //

const NatixarChart = () => {
  const [areaSlot, setAreaSlot] = useState("month")
  const [acquisitionSlot, setAcquisitionSlot] = useState("month")

  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      <Grid item xs={12} md={12} xl={12}>
        <MainCard>
          <Typography variant="h5" sx={{ marginBottom: "15px" }}>
            Scope Emissions
          </Typography>
          <CO2DonutSection />
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
          <IncomeAreaChart slot={areaSlot} />
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
        >
          <AcquisitionChart slot={acquisitionSlot} />
        </ChartCard>
      </Grid>
    </Grid>
  )
}

export default NatixarChart
